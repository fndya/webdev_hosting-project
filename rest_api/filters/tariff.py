import django_filters

from hosting.models import Tariff


class TariffFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(
        field_name="title",
        lookup_expr="icontains",
    )

    min_price = django_filters.NumberFilter(
        field_name="price_monthly",
        lookup_expr="gte",
    )

    max_price = django_filters.NumberFilter(
        field_name="price_monthly",
        lookup_expr="lte",
    )

    cpu_cores = django_filters.NumberFilter(
        field_name="cpu_cores",
        lookup_expr="exact",
    )

    ram_gb = django_filters.NumberFilter(
        field_name="ram_gb",
        lookup_expr="exact",
    )

    storage_gb = django_filters.NumberFilter(
        field_name="storage_gb",
        lookup_expr="exact",
    )

    is_recommended = django_filters.BooleanFilter(
        field_name="is_recommended",
    )

    is_active = django_filters.BooleanFilter(
        field_name="is_active",
    )

    class Meta:
        model = Tariff
        fields = (
            "title",
            "min_price",
            "max_price",
            "cpu_cores",
            "ram_gb",
            "storage_gb",
            "is_recommended",
            "is_active",
        )