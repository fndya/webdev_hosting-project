from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from hosting.cart import Cart
from hosting.models import Tariff

from rest_api.serializers.cart import (
    CartItemCreateSerializer,
    CartItemUpdateSerializer,
    CartSerializer,
)


class CartView(APIView):
    def get(self, request):
        cart = Cart(request)

        items = []

        for item in cart:
            tariff = item["tariff"]

            items.append(
                {
                    "tariff_id": tariff.id,
                    "tariff_title": tariff.title,
                    "quantity": item["quantity"],
                    "price": item["price"],
                    "total_price": item["total_price"],
                }
            )

        data = {
            "items": items,
            "total_quantity": len(cart),
            "total_price": cart.get_total_price(),
        }

        return Response(CartSerializer(data).data)

    def delete(self, request):
        cart = Cart(request)
        cart.clear()

        return Response(
            {"detail": "Корзина очищена."},
            status=status.HTTP_200_OK,
        )


class CartItemCreateView(APIView):
    def post(self, request):
        serializer = CartItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tariff_id = serializer.validated_data["tariff_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            tariff = Tariff.objects.get(
                id=tariff_id,
                is_active=True,
            )
        except Tariff.DoesNotExist:
            return Response(
                {"detail": "Тариф не найден или недоступен."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = Cart(request)
        cart.add(tariff, quantity=quantity)

        return Response(
            {"detail": "Тариф добавлен в корзину."},
            status=status.HTTP_201_CREATED,
        )


class CartItemUpdateView(APIView):
    def patch(self, request, tariff_id):
        serializer = CartItemUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data["quantity"]

        try:
            tariff = Tariff.objects.get(
                id=tariff_id,
                is_active=True,
            )
        except Tariff.DoesNotExist:
            return Response(
                {"detail": "Тариф не найден или недоступен."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = Cart(request)

        if str(tariff.id) not in cart.cart:
            return Response(
                {"detail": "Тариф отсутствует в корзине."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart.add(
            tariff,
            quantity=quantity,
            override_quantity=True,
        )

        return Response(
            {"detail": "Количество тарифа обновлено."},
            status=status.HTTP_200_OK,
        )


class CartItemDeleteView(APIView):
    def delete(self, request, tariff_id):
        try:
            tariff = Tariff.objects.get(
                id=tariff_id,
            )
        except Tariff.DoesNotExist:
            return Response(
                {"detail": "Тариф не найден."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = Cart(request)

        if str(tariff.id) not in cart.cart:
            return Response(
                {"detail": "Тариф отсутствует в корзине."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart.remove(tariff)

        return Response(
            {"detail": "Тариф удалён из корзины."},
            status=status.HTTP_200_OK,
        )