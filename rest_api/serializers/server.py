from rest_framework import serializers

from hosting.models import Server


class ServerSerializer(serializers.ModelSerializer):
    tariff_title = serializers.CharField(
        source="tariff.title",
        read_only=True,
    )
    status_name = serializers.CharField(
        source="status.name",
        read_only=True,
    )
    is_expired = serializers.BooleanField(
        read_only=True,
    )

    class Meta:
        model = Server
        fields = (
            "id",
            "tariff",
            "tariff_title",
            "status",
            "status_name",
            "ip_address",
            "order",
            "login",
            "created_at",
            "updated_at",
            "expires_at",
            "is_expired",
        )
        read_only_fields = (
            "id",
            "tariff",
            "tariff_title",
            "status",
            "status_name",
            "ip_address",
            "order",
            "login",
            "created_at",
            "updated_at",
            "expires_at",
            "is_expired",
        )