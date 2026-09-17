from django.core.cache import cache

from django_filters.rest_framework import (
    DjangoFilterBackend,
)

from rest_framework import filters
from rest_framework.parsers import (
    FormParser,
    JSONParser,
    MultiPartParser,
)
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.pagination import PageNumberPagination

from rest_api.filters.tariff import TariffFilter
from rest_api.permissions import IsAdminByRole
from rest_api.serializers.tariff import TariffSerializer

from hosting.models import Tariff, User


class TariffPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 50


class TariffListCreateView(ListCreateAPIView):
    serializer_class = TariffSerializer
    pagination_class = TariffPagination

    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    )

    filterset_class = TariffFilter

    search_fields = (
        "title",
        "description",
    )

    ordering_fields = (
        "title",
        "price_monthly",
        "created_at",
        "updated_at",
    )

    ordering = (
        "price_monthly",
    )

    permission_classes = (
        IsAdminByRole,
    )

    parser_classes = (
        JSONParser,
        MultiPartParser,
        FormParser,
    )

    def get_queryset(self):
        user_id = self.request.session.get(
            "user_id"
        )

        is_admin = False

        if user_id:
            try:
                user = (
                    User.objects
                    .select_related("role")
                    .get(id=user_id)
                )

                is_admin = bool(
                    user.role
                    and user.role.name == "admin"
                )
            except User.DoesNotExist:
                pass

        queryset = (
            Tariff.objects
            .prefetch_related(
                "features",
                "images",
            )
        )

        if not is_admin:
            queryset = queryset.filter(
                is_active=True
            )

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()

        user_id = self.request.session.get(
            "user_id"
        )

        request_user = None

        if user_id:
            try:
                request_user = User.objects.get(
                    id=user_id
                )
            except User.DoesNotExist:
                pass

        context["request_user"] = request_user

        return context

    def perform_create(self, serializer):
        serializer.save()

        cache.delete(
            "active_tariffs"
        )


class TariffDetailView(
    RetrieveUpdateDestroyAPIView
):
    serializer_class = TariffSerializer

    permission_classes = (
        IsAdminByRole,
    )

    parser_classes = (
        JSONParser,
        MultiPartParser,
        FormParser,
    )

    def get_queryset(self):
        user_id = self.request.session.get(
            "user_id"
        )

        is_admin = False

        if user_id:
            try:
                user = (
                    User.objects
                    .select_related("role")
                    .get(id=user_id)
                )

                is_admin = bool(
                    user.role
                    and user.role.name == "admin"
                )
            except User.DoesNotExist:
                pass

        queryset = (
            Tariff.objects
            .prefetch_related(
                "features",
                "images",
            )
        )

        if not is_admin:
            queryset = queryset.filter(
                is_active=True
            )

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()

        user_id = self.request.session.get(
            "user_id"
        )

        request_user = None

        if user_id:
            try:
                request_user = User.objects.get(
                    id=user_id
                )
            except User.DoesNotExist:
                pass

        context["request_user"] = request_user

        return context

    def perform_update(self, serializer):
        serializer.save()

        cache.delete(
            "active_tariffs"
        )

    def perform_destroy(self, instance):
        instance.delete()

        cache.delete(
            "active_tariffs"
        )