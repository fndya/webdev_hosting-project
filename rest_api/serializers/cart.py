from rest_framework import serializers


class CartItemSerializer(serializers.Serializer):
    tariff_id = serializers.IntegerField()
    tariff_title = serializers.CharField()
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )


class CartSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True)
    total_quantity = serializers.IntegerField()
    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )


class CartItemCreateSerializer(serializers.Serializer):
    tariff_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(
        min_value=1,
        default=1,
    )


class CartItemUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)