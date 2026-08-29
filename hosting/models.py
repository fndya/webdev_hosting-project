from django.db import models
from django.urls import reverse

class Role(models.Model):
    name = models.CharField(
        max_length=50,
        verbose_name="Название роли"
    )

    class Meta:
        verbose_name = "Роль"
        verbose_name_plural = "Роли"

    def __str__(self):
        return self.name


class User(models.Model):
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="users",
        verbose_name="Роль"
    )
    name = models.CharField(
        max_length=100,
        verbose_name="Имя"
    )
    email = models.EmailField(
        unique=True,
        verbose_name="Email"
    )
    password_hash = models.CharField(
        max_length=255,
        verbose_name="Хэш пароля"
    )
    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Баланс"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата изменения"
    )

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"{self.name} ({self.email})"


class ServerStatus(models.Model):
    name = models.CharField(
        max_length=50,
        verbose_name="Название статуса"
    )

    class Meta:
        verbose_name = "Статус сервера"
        verbose_name_plural = "Статусы серверов"

    def __str__(self):
        return self.name


class TariffFeature(models.Model):
    title = models.CharField(
        max_length=100,
        verbose_name="Название характеристики"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Описание"
    )

    class Meta:
        verbose_name = "Характеристика тарифа"
        verbose_name_plural = "Характеристики тарифов"

    def __str__(self):
        return self.title


class Image(models.Model):
    url = models.URLField(
        verbose_name="URL изображения"
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Альтернативный текст"
    )
    image_type = models.CharField(
        max_length=50,
        verbose_name="Тип изображения"
    )
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_images",
        verbose_name="Кто загрузил"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата загрузки"
    )

    class Meta:
        verbose_name = "Изображение"
        verbose_name_plural = "Изображения"

    def __str__(self):
        return self.alt_text or self.url

class ActiveTariffManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

class Tariff(models.Model):
    title = models.CharField(
        max_length=100,
        verbose_name="Название тарифа"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Описание"
    )
    cpu_cores = models.PositiveIntegerField(
        verbose_name="Количество ядер CPU"
    )
    ram_gb = models.PositiveIntegerField(
        verbose_name="Оперативная память, ГБ"
    )
    storage_gb = models.PositiveIntegerField(
        verbose_name="Диск, ГБ"
    )
    traffic = models.CharField(
        max_length=100,
        verbose_name="Трафик"
    )
    price_monthly = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Цена в месяц"
    )
    is_recommended = models.BooleanField(
        default=False,
        verbose_name="Рекомендуемый тариф"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен"
    )
    features = models.ManyToManyField(
        TariffFeature,
        blank=True,
        related_name="tariffs",
        verbose_name="Характеристики"
    )
    images = models.ManyToManyField(
        Image,
        blank=True,
        related_name="tariffs",
        verbose_name="Изображения"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_tariffs",
        verbose_name="Кто создал"
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_tariffs",
        verbose_name="Кто изменил"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата изменения"
    )

    objects = models.Manager()
    active = ActiveTariffManager()

    class Meta:
        verbose_name = "Тариф"
        verbose_name_plural = "Тарифы"
        ordering = ["price_monthly"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("tariff_detail", kwargs={"tariff_id": self.id})


class Server(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="servers",
        verbose_name="Пользователь"
    )
    tariff = models.ForeignKey(
        Tariff,
        on_delete=models.PROTECT,
        related_name="servers",
        verbose_name="Тариф"
    )
    status = models.ForeignKey(
        ServerStatus,
        on_delete=models.PROTECT,
        related_name="servers",
        verbose_name="Статус"
    )
    ip_address = models.CharField(
        max_length=50,
        verbose_name="IP-адрес"
    )
    login = models.CharField(
        max_length=50,
        default="root",
        verbose_name="Логин"
    )
    password = models.CharField(
        max_length=100,
        verbose_name="Пароль доступа"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата изменения"
    )
    expires_at = models.DateTimeField(
        verbose_name="Дата окончания аренды"
    )

    class Meta:
        verbose_name = "Сервер"
        verbose_name_plural = "Серверы"

    def __str__(self):
        return f"{self.ip_address} — {self.user.email}"


class Order(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Пользователь"
    )
    tariff = models.ForeignKey(
        Tariff,
        on_delete=models.PROTECT,
        related_name="orders",
        verbose_name="Тариф"
    )
    server = models.ForeignKey(
        Server,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
        verbose_name="Созданный сервер"
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Итоговая цена"
    )
    status = models.CharField(
        max_length=50,
        verbose_name="Статус заказа"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата изменения"
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ #{self.id} — {self.user.email}"


class BalanceTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("top_up", "Пополнение"),
        ("purchase", "Покупка"),
        ("refund", "Возврат"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="balance_transactions",
        verbose_name="Пользователь"
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
        verbose_name="Заказ"
    )
    transaction_type = models.CharField(
        max_length=50,
        choices=TRANSACTION_TYPES,
        verbose_name="Тип операции"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Сумма"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата операции"
    )

    class Meta:
        verbose_name = "Операция баланса"
        verbose_name_plural = "Операции баланса"

    def __str__(self):
        return f"{self.get_transaction_type_display()} — {self.amount}"


class ContactRequest(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_requests",
        verbose_name="Пользователь"
    )
    name = models.CharField(
        max_length=100,
        verbose_name="Имя"
    )
    email = models.EmailField(
        verbose_name="Email"
    )
    phone = models.CharField(
        max_length=30,
        blank=True,
        verbose_name="Телефон"
    )
    message = models.TextField(
        verbose_name="Сообщение"
    )
    status = models.CharField(
        max_length=50,
        default="new",
        verbose_name="Статус заявки"
    )
    handled_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="handled_requests",
        verbose_name="Кто обработал"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата изменения"
    )

    class Meta:
        verbose_name = "Заявка обратной связи"
        verbose_name_plural = "Заявки обратной связи"

    def __str__(self):
        return f"{self.name} — {self.email}"