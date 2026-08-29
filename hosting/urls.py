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
]