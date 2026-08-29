from decimal import Decimal

from django.conf import settings

from .models import Tariff

class Cart:
    def __init__(self, request):
        self.session = request.session

        cart = self.session.get(
            settings.CART_SESSION_ID
        )

        if cart is None:
            cart = self.session[
                settings.CART_SESSION_ID
            ] = {}

        self.cart = cart

    def add(
        self,
        tariff,
        quantity=1,
        override_quantity=False
    ):
        tariff_id = str(tariff.id)

        if tariff_id not in self.cart:
            self.cart[tariff_id] = {
                "quantity": 0,
                "price": str(tariff.price_monthly)
            }

        if override_quantity:
            self.cart[tariff_id]["quantity"] = quantity
        else:
            self.cart[tariff_id]["quantity"] += quantity

        self.save()

    def save(self):
        self.session.modified = True

    def remove(self, tariff):
        tariff_id = str(tariff.id)

        if tariff_id in self.cart:
            del self.cart[tariff_id]

        self.save()

    def __iter__(self):
        tariff_ids = self.cart.keys()

        tariffs = Tariff.objects.filter(
            id__in=tariff_ids
        )

        cart = self.cart.copy()

        for tariff in tariffs:
            cart[str(tariff.id)]["tariff"] = tariff

        for item in cart.values():
            item["price"] = Decimal(item["price"])

            item["total_price"] = (
                item["price"]
                * item["quantity"]
            )

            yield item

    def __len__(self):
        return sum(
            item["quantity"]
            for item in self.cart.values()
        )

    def get_total_price(self):
        return sum(
            Decimal(item["price"])
            * item["quantity"]
            for item in self.cart.values()
        )

    def clear(self):
        del self.session[
            settings.CART_SESSION_ID
        ]

        self.save()