from django.urls import path

from rest_api.views.tariff import (
    TariffDetailView,
    TariffListCreateView,
)


urlpatterns = [
    path(
        "tariffs/",
        TariffListCreateView.as_view(),
        name="api-tariff-list",
    ),
    path(
        "tariffs/<int:pk>/",
        TariffDetailView.as_view(),
        name="api-tariff-detail",
    ),
]