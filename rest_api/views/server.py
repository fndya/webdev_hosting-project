from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView

from hosting.models import Server, User
from rest_api.permissions import IsAdminByRoleOnly
from rest_api.serializers.server import (
    ServerSerializer,
    AdminServerSerializer,
)


def get_session_user(request):
    user_id = request.session.get("user_id")

    if not user_id:
        return None

    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


class ServerListView(ListAPIView):
    serializer_class = ServerSerializer

    def get_queryset(self):
        user = get_session_user(self.request)

        if not user:
            return Server.objects.none()

        return (
            Server.objects
            .filter(user=user)
            .select_related("tariff", "status", "order")
            .order_by("-created_at")
        )


class ServerDetailView(RetrieveAPIView):
    serializer_class = ServerSerializer

    def get_queryset(self):
        user = get_session_user(self.request)

        if not user:
            return Server.objects.none()

        return (
            Server.objects
            .filter(user=user)
            .select_related("tariff", "status", "order")
        )

class AdminServerListView(ListAPIView):
    serializer_class = AdminServerSerializer
    permission_classes = (IsAdminByRoleOnly,)

    def get_queryset(self):
        return (
            Server.objects
            .select_related(
                "user",
                "tariff",
                "status",
                "order",
            )
            .order_by("-created_at")
        )


class AdminServerDetailView(RetrieveUpdateAPIView):
    serializer_class = AdminServerSerializer
    permission_classes = (IsAdminByRoleOnly,)

    def get_queryset(self):
        return (
            Server.objects
            .select_related(
                "user",
                "tariff",
                "status",
                "order",
            )
        )