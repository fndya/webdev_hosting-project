from django.db import transaction
from django.db.models import F
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView

from hosting.cart import Cart
from hosting.models import (
    BalanceTransaction,
    Order,
    User,
)
from hosting.tasks import provision_order

from rest_api.serializers.order import OrderSerializer


def get_session_user(request):
    user_id = request.session.get("user_id")

    if not user_id:
        return None

    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


class OrderListView(ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = get_session_user(self.request)

        if not user:
            return Order.objects.none()

        return (
            Order.objects
            .filter(user=user)
            .select_related("tariff", "server")
            .order_by("-created_at")
        )


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = get_session_user(self.request)

        if not user:
            return Order.objects.none()

        return (
            Order.objects
            .filter(user=user)
            .select_related("tariff", "server")
        )


class OrderCheckoutView(APIView):
    def post(self, request):
        user_id = request.session.get("user_id")

        if not user_id:
            return Response(
                {
                    "detail": "Необходимо авторизоваться."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        cart = Cart(request)
        items = list(cart)

        if not items:
            return Response(
                {
                    "detail": "Корзина пуста."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_amount = sum(
            item["total_price"]
            for item in items
        )

        with transaction.atomic():
            user = (
                User.objects
                .select_for_update()
                .get(id=user_id)
            )

            if user.balance < total_amount:
                return Response(
                    {
                        "detail": (
                            "Недостаточно средств на балансе. "
                            f"Сумма заказа: {total_amount:.2f} ₽, "
                            f"ваш баланс: {user.balance:.2f} ₽."
                        ),
                        "required": total_amount,
                        "balance": user.balance,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            User.objects.filter(id=user.id).update(
                balance=F("balance") - total_amount,
            )

            user.refresh_from_db()

            user.save(
                update_fields=[
                    "balance",
                    "updated_at",
                ]
            )

            created_orders = []

            for item in items:
                order = Order.objects.create(
                    user=user,
                    tariff=item["tariff"],
                    quantity=item["quantity"],
                    total_price=item["total_price"],
                    status=Order.STATUS_NEW,
                )

                BalanceTransaction.objects.create(
                    user=user,
                    order=order,
                    transaction_type="purchase",
                    amount=item["total_price"],
                )

                transaction.on_commit(
                    lambda order_id=order.id: provision_order.apply_async(
                        args=[order_id],
                        countdown=10,
                    )
                )

                created_orders.append(order)

            cart.clear()

        return Response(
            OrderSerializer(
                created_orders,
                many=True,
            ).data,
            status=status.HTTP_201_CREATED,
        )