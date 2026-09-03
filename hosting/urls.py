from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("pricing/", views.pricing, name="pricing"),
    path(
        "pricing/<int:tariff_id>/",
        views.tariff_detail,
        name="tariff_detail"
    ),
    path(
        "pricing/create/",
        views.tariff_create,
        name="tariff_create"
    ),
    path(
        "pricing/<int:tariff_id>/edit/",
        views.tariff_edit,
        name="tariff_edit"
    ),
    path(
        "pricing/<int:tariff_id>/delete/",
        views.tariff_delete,
        name="tariff_delete"
    ),
    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("cart/", views.cart_detail, name="cart_detail"),
    path("cart/add/<int:tariff_id>/", views.cart_add, name="cart_add"),
    path("cart/decrease/<int:tariff_id>/", views.cart_decrease, name="cart_decrease"),
    path("cart/remove/<int:tariff_id>/", views.cart_remove, name="cart_remove"),
    path("cart/checkout/", views.cart_checkout, name="cart_checkout"),
]