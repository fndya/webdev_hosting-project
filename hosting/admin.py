from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import (
    Role,
    User,
    ServerStatus,
    TariffFeature,
    Image,
    Tariff,
    Server,
    Order,
    BalanceTransaction,
    ContactRequest,
)


class ServerInline(admin.TabularInline):
    model = Server
    extra = 0
    raw_id_fields = ("tariff", "status")
    readonly_fields = ("created_at", "updated_at")


class OrderInline(admin.TabularInline):
    model = Order
    extra = 0
    raw_id_fields = ("tariff", "server")
    readonly_fields = ("created_at", "updated_at")


class BalanceTransactionInline(admin.TabularInline):
    model = BalanceTransaction
    extra = 0
    raw_id_fields = ("order",)
    readonly_fields = ("created_at",)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "role",
        "balance",
        "server_count",
        "created_at",
    )
    list_display_links = ("id", "email")
    list_filter = ("role", "created_at")
    search_fields = ("name", "email")
    date_hierarchy = "created_at"
    readonly_fields = ("created_at", "updated_at")
    raw_id_fields = ("role",)
    inlines = (ServerInline, OrderInline, BalanceTransactionInline)

    @admin.display(description="Количество серверов")
    def server_count(self, obj):
        return obj.servers.count()


@admin.register(ServerStatus)
class ServerStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(TariffFeature)
class TariffFeatureAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "short_description")
    list_display_links = ("id", "title")
    search_fields = ("title", "description")

    @admin.display(description="Краткое описание")
    def short_description(self, obj):
        if obj.description:
            return obj.description[:50]
        return "Нет описания"


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "alt_text",
        "image_type",
        "uploaded_by",
        "created_at",
    )
    list_display_links = ("id", "alt_text")
    list_filter = ("image_type", "created_at")
    search_fields = ("alt_text", "url")
    raw_id_fields = ("uploaded_by",)
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"


@admin.register(Tariff)
class TariffAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "price_monthly",
        "cpu_cores",
        "ram_gb",
        "storage_gb",
        "is_recommended",
        "is_active",
        "features_count",
        "created_at",
    )
    list_display_links = ("id", "title")
    list_filter = ("is_recommended", "is_active", "created_at")
    search_fields = ("title", "description", "traffic")
    filter_horizontal = ("features", "images")
    raw_id_fields = ("created_by", "updated_by")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"

    @admin.display(description="Кол-во характеристик")
    def features_count(self, obj):
        return obj.features.count()


@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ip_address",
        "user",
        "tariff",
        "status",
        "login",
        "is_expired",
        "created_at",
        "expires_at",
    )
    list_display_links = ("id", "ip_address")
    list_filter = ("status", "tariff", "created_at", "expires_at")
    search_fields = (
        "ip_address",
        "login",
        "user__email",
        "user__name",
        "tariff__title",
    )
    raw_id_fields = ("user", "tariff", "status")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"

    @admin.display(boolean=True, description="Истёк")
    def is_expired(self, obj):
        from django.utils import timezone
        return obj.expires_at < timezone.now()


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "tariff",
        "server",
        "total_price",
        "status",
        "created_at",
    )
    list_display_links = ("id", "user")
    list_filter = ("status", "tariff", "created_at")
    search_fields = (
        "user__email",
        "user__name",
        "tariff__title",
        "status",
    )
    raw_id_fields = ("user", "tariff", "server")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    inlines = (BalanceTransactionInline,)


@admin.register(BalanceTransaction)
class BalanceTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "transaction_type",
        "amount",
        "order",
        "created_at",
    )
    list_display_links = ("id", "user")
    list_filter = ("transaction_type", "created_at")
    search_fields = (
        "user__email",
        "user__name",
        "transaction_type",
    )
    raw_id_fields = ("user", "order")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "phone",
        "status",
        "handled_by",
        "short_message",
        "created_at",
    )
    list_display_links = ("id", "email")
    list_filter = ("status", "created_at")
    search_fields = (
        "name",
        "email",
        "phone",
        "message",
    )
    raw_id_fields = ("user", "handled_by")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"

    @admin.display(description="Короткое сообщение")
    def short_message(self, obj):
        return obj.message[:70]