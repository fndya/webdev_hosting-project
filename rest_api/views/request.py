from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView,
)
from rest_framework.response import Response

from hosting.models import ContactRequest, User
from rest_api.serializers.request import ContactRequestSerializer


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