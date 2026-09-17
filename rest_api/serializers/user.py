from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from hosting.models import Role, User


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(
        source="role.name",
        read_only=True,
    )
    balance = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "role",
            "balance",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "role",
            "balance",
            "created_at",
            "updated_at",
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=1,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        min_length=1,
    )

    class Meta:
        model = User
        fields = (
            "name",
            "email",
            "password",
            "password_confirm",
        )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким email уже существует."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Пароли не совпадают."
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")

        password = validated_data.pop("password")

        role = Role.objects.get(name="user")

        user = User.objects.create(
            role=role,
            password_hash=make_password(password),
            **validated_data,
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
    )