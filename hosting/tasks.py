from datetime import timedelta
import secrets

from celery import shared_task
from django.db import OperationalError, transaction
from django.utils import timezone

from .models import Order, Server, ServerStatus


def generate_ip_address():
    """Генерирует свободный тестовый IP-адрес."""
    while True:
        ip_address = f"192.0.2.{secrets.randbelow(254) + 1}"

        if not Server.objects.filter(ip_address=ip_address).exists():
            return ip_address


def generate_password():
    """Генерирует случайный пароль доступа."""
    return secrets.token_urlsafe(18)

@shared_task
def provision_order(order_id):
    """Выдаёт все серверы по заказу через Celery."""
    with transaction.atomic():
        order = (
            Order.objects
            .select_for_update()
            .select_related("user", "tariff")
            .get(id=order_id)
        )

        if order.status in (
            Order.STATUS_CANCELLED,
            Order.STATUS_REFUNDED,
        ):
            return f"Заказ #{order.id}: обработка отменена"

        created_count = order.servers.count()

        if created_count >= order.quantity:
            return f"Заказ #{order.id}: все серверы уже созданы"

        order.status = Order.STATUS_PROCESSING
        order.save(update_fields=["status", "updated_at"])

        server_status = ServerStatus.objects.filter(
            name="active"
        ).first()

        if server_status is None:
            raise RuntimeError(
                "Не найден статус сервера «active». "
                "Создай его в административной панели."
            )

        remaining = order.quantity - created_count

        for _ in range(remaining):
            Server.objects.create(
                order=order,
                user=order.user,
                tariff=order.tariff,
                status=server_status,
                ip_address=generate_ip_address(),
                login="root",
                password=generate_password(),
                expires_at=timezone.now() + timedelta(days=30),
            )

        order.status = Order.STATUS_COMPLETED
        order.save(update_fields=["status", "updated_at"])

        return (
            f"Заказ #{order.id}: "
            f"создано серверов — {order.quantity}"
        )