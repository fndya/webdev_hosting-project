from rest_framework import serializers

from hosting.models import ContactRequest, User


class ContactRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:
        model = ContactRequest
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "message",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        request = self.context["request"]
        user_id = request.session.get("user_id")

        if user_id:
            try:
                user = User.objects.get(id=user_id)
                validated_data["user"] = user
            except User.DoesNotExist:
                pass

        return super().create(validated_data)

class AdminContactRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )
    user_email = serializers.CharField(
        source="user.email",
        read_only=True,
    )
    handled_by_email = serializers.CharField(
        source="handled_by.email",
        read_only=True,
    )

    class Meta:
        model = ContactRequest
        fields = (
            "id",
            "user",
            "user_email",
            "name",
            "email",
            "phone",
            "message",
            "status",
            "status_display",
            "handled_by",
            "handled_by_email",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "user",
            "user_email",
            "name",
            "email",
            "phone",
            "message",
            "status_display",
            "handled_by",
            "handled_by_email",
            "created_at",
            "updated_at",
        )