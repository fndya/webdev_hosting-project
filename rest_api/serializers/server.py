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

class AdminServerSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(
        source="user.email",
        read_only=True,
    )
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
    password = serializers.CharField(
        write_only=True,
        required=False,
    )

    class Meta:
        model = Server
        fields = (
            "id",
            "user",
            "user_email",
            "tariff",
            "tariff_title",
            "status",
            "status_name",
            "ip_address",
            "order",
            "login",
            "password",
            "created_at",
            "updated_at",
            "expires_at",
            "is_expired",
        )
        read_only_fields = (
            "id",
            "user",
            "user_email",
            "tariff",
            "tariff_title",
            "status_name",
            "ip_address",
            "order",
            "created_at",
            "updated_at",
            "is_expired",
        )