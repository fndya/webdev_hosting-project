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

from rest_api.views.cart import (
    CartItemCreateView,
    CartItemDeleteView,
    CartItemUpdateView,
    CartView,
)

from rest_api.views.server import (
    ServerDetailView,
    ServerListView,
)

from rest_api.views.request import (
    ContactRequestDetailView,
    ContactRequestListCreateView,
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
    path("cart/", CartView.as_view(), name="cart"),
    path(
        "cart/items/",
        CartItemCreateView.as_view(),
        name="cart_item_create",
    ),
    path(
        "cart/items/<int:tariff_id>/",
        CartItemUpdateView.as_view(),
        name="cart_item_update",
    ),
    path(
        "cart/items/<int:tariff_id>/delete/",
        CartItemDeleteView.as_view(),
        name="cart_item_delete",
    ),
    path(
        "servers/",
        ServerListView.as_view(),
        name="api-server-list",
    ),
    path(
        "servers/<int:pk>/",
        ServerDetailView.as_view(),
        name="api-server-detail",
    ),
    path(
        "requests/",
        ContactRequestListCreateView.as_view(),
        name="api-request-list-create",
    ),
    path(
        "requests/<int:pk>/",
        ContactRequestDetailView.as_view(),
        name="api-request-detail",
    ),
]