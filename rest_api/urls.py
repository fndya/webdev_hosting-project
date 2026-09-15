from django.urls import path

from rest_api.views.auth import (
    CurrentUserView,
    LoginView,
    LogoutView,
    RegisterView,
)

from rest_api.views.order import (
    OrderCheckoutView,
    OrderDetailView,
    OrderListView,
)

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

    path(
        "auth/register/",
        RegisterView.as_view(),
        name="api-register",
    ),
    path(
        "auth/login/",
        LoginView.as_view(),
        name="api-login",
    ),
    path(
        "auth/logout/",
        LogoutView.as_view(),
        name="api-logout",
    ),
    path(
        "auth/me/",
        CurrentUserView.as_view(),
        name="api-current-user",
    ),
    path(
        "orders/",
        OrderListView.as_view(),
        name="api-order-list",
    ),
    path(
        "orders/<int:pk>/",
        OrderDetailView.as_view(),
        name="api-order-detail",
    ),
    path(
        "orders/checkout/",
        OrderCheckoutView.as_view(),
        name="api-order-checkout",
    ),
]