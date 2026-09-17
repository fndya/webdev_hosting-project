from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView,
    ListAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.response import Response

from hosting.models import ContactRequest, User
from rest_api.permissions import IsAdminByRoleOnly
from rest_api.serializers.request import (
    ContactRequestSerializer,
    AdminContactRequestSerializer,
)


def get_session_user(request):
    user_id = request.session.get("user_id")

    if not user_id:
        return None

    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


class ContactRequestListCreateView(ListCreateAPIView):
    serializer_class = ContactRequestSerializer

    def get_queryset(self):
        user = get_session_user(self.request)

        if not user:
            return ContactRequest.objects.none()

        return (
            ContactRequest.objects
            .filter(user=user)
            .order_by("-created_at")
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact_request = serializer.save()

        return Response(
            ContactRequestSerializer(
                contact_request,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )


class ContactRequestDetailView(RetrieveAPIView):
    serializer_class = ContactRequestSerializer

    def get_queryset(self):
        user = get_session_user(self.request)

        if not user:
            return ContactRequest.objects.none()

        return ContactRequest.objects.filter(user=user)

class AdminContactRequestListView(ListAPIView):
    serializer_class = AdminContactRequestSerializer
    permission_classes = (IsAdminByRoleOnly,)

    def get_queryset(self):
        return (
            ContactRequest.objects
            .select_related("user", "handled_by")
            .order_by("-created_at")
        )


class AdminContactRequestDetailView(RetrieveUpdateAPIView):
    serializer_class = AdminContactRequestSerializer
    permission_classes = (IsAdminByRoleOnly,)

    def get_queryset(self):
        return (
            ContactRequest.objects
            .select_related("user", "handled_by")
        )

    def perform_update(self, serializer):
        user = get_session_user(self.request)

        serializer.save(
            handled_by=user,
        )