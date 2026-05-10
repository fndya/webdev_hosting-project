from decimal import Decimal
from random import randint, choice

from django.core.management.base import BaseCommand
from django.utils import timezone

from hosting.models import (
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


class Command(BaseCommand):
    help = "Заполняет базу тестовыми данными"

    def handle(self, *args, **options):
        roles = []
        for name in ["user", "admin", "manager", "support", "moderator", "operator", "client", "owner", "analyst", "tester"]:
            role, _ = Role.objects.get_or_create(name=name)
            roles.append(role)

        statuses = []
        for name in ["creating", "active", "stopped", "rebooting", "expired", "pending", "blocked", "deleted", "maintenance", "error"]:
            status, _ = ServerStatus.objects.get_or_create(name=name)
            statuses.append(status)

        users = []
        for i in range(1, 11):
            user, _ = User.objects.get_or_create(
                email=f"user{i}@example.com",
                defaults={
                    "role": roles[0],
                    "name": f"Пользователь {i}",
                    "password_hash": "demo_hash",
                    "balance": Decimal(randint(500, 10000)),
                }
            )
            users.append(user)

        features = []
        feature_titles = [
            "SSD-диск",
            "DDoS-защита",
            "Быстрый запуск",
            "Root-доступ",
            "Резервное копирование",
            "Поддержка 24/7",
            "Гибкая конфигурация",
            "Мониторинг",
            "Безлимитный трафик",
            "Панель управления",
        ]

        for title in feature_titles:
            feature, _ = TariffFeature.objects.get_or_create(
                title=title,
                defaults={"description": f"Описание характеристики: {title}"}
            )
            features.append(feature)

        images = []
        for i in range(1, 11):
            image, _ = Image.objects.get_or_create(
                url=f"https://example.com/images/server-{i}.jpg",
                defaults={
                    "alt_text": f"Изображение сервера {i}",
                    "image_type": "tariff",
                    "uploaded_by": choice(users),
                }
            )
            images.append(image)

        tariffs = []
        tariff_names = [
            "Стартовый",
            "Минимальный",
            "Оптимальный",
            "Оптимальный+",
            "Универсальный",
            "Бизнес",
            "Бизнес+",
            "Профессиональный",
            "Премиум",
            "Корпоративный",
        ]

        for i, name in enumerate(tariff_names, start=1):
            tariff, _ = Tariff.objects.get_or_create(
                title=name,
                defaults={
                    "description": f"Тариф {name} подходит для учебных и коммерческих проектов.",
                    "cpu_cores": randint(1, 8),
                    "ram_gb": randint(1, 32),
                    "storage_gb": randint(20, 500),
                    "traffic": "Безлимитный",
                    "price_monthly": Decimal(randint(300, 5000)),
                    "is_recommended": i == 3,
                    "is_active": True,
                    "created_by": choice(users),
                    "updated_by": choice(users),
                }
            )

            tariff.features.set(features[:randint(3, 6)])
            tariff.images.set(images[:randint(1, 3)])
            tariffs.append(tariff)

        servers = []
        active_status = ServerStatus.objects.get(name="active")

        for i in range(1, 11):
            server, _ = Server.objects.get_or_create(
                ip_address=f"192.168.1.{i}",
                defaults={
                    "user": choice(users),
                    "tariff": choice(tariffs),
                    "status": choice(statuses),
                    "login": "root",
                    "password": f"pass{i}demo",
                    "expires_at": timezone.now() + timezone.timedelta(days=30 + i),
                }
            )
            servers.append(server)

        for i in range(1, 11):
            order, _ = Order.objects.get_or_create(
                id=i,
                defaults={
                    "user": choice(users),
                    "tariff": choice(tariffs),
                    "server": choice(servers),
                    "total_price": Decimal(randint(300, 5000)),
                    "status": choice(["created", "paid", "cancelled"]),
                }
            )

            BalanceTransaction.objects.get_or_create(
                id=i,
                defaults={
                    "user": order.user,
                    "order": order,
                    "transaction_type": choice(["top_up", "purchase", "refund"]),
                    "amount": Decimal(randint(300, 5000)),
                }
            )

        for i in range(1, 11):
            ContactRequest.objects.get_or_create(
                email=f"client{i}@example.com",
                defaults={
                    "user": choice(users),
                    "name": f"Клиент {i}",
                    "phone": f"+799900000{i}",
                    "message": f"Здравствуйте, нужна консультация по тарифу {i}.",
                    "status": choice(["new", "in_progress", "closed"]),
                    "handled_by": choice(users),
                }
            )

        self.stdout.write(self.style.SUCCESS("База успешно заполнена тестовыми данными"))