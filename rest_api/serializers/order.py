from rest_framework import serializers

from hosting.models import Order


class OrderSerializer(serializers.ModelSerializer):
    tariff_title = serializers.CharField(
        source="tariff.title",
        read_only=True,
    )
    server_ip = serializers.CharField(
        source="server.ip_address",
        read_only=True,
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "tariff",
            "tariff_title",
            "quantity",
            "server",
            "server_ip",
            "total_price",
            "pdf_file",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "tariff",
            "tariff_title",
            "server",
            "server_ip",
            "total_price",
            "pdf_file",
            "status",
            "created_at",
            "updated_at",
        )