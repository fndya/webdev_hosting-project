from io import BytesIO

from django.core.files.base import ContentFile
from django.utils import timezone

from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas


def generate_order_pdf(order):
    buffer = BytesIO()

    pdf = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4

    pdfmetrics.registerFont(
        TTFont(
            "DejaVuSans",
            "/usr/share/fonts/TTF/DejaVuSans.ttf"
        )
    )

    pdf.setFont("DejaVuSans", 20)
    pdf.drawString(50, height - 60, "ТУРБОСЕРВЕР")

    pdf.setFont("DejaVuSans", 16)
    pdf.drawString(50, height - 100, f"Заказ №{order.id}")

    pdf.setFont("DejaVuSans", 11)

    y = height - 145

    pdf.drawString(
        50,
        y,
        f"Дата: {timezone.localtime(order.created_at).strftime('%d.%m.%Y %H:%M')}"
    )

    y -= 25

    pdf.drawString(
        50,
        y,
        f"Пользователь: {order.user.name}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Email: {order.user.email}"
    )

    y -= 40

    pdf.setFont("DejaVuSans", 13)
    pdf.drawString(50, y, "Информация о заказе")

    y -= 30

    pdf.setFont("DejaVuSans", 11)

    pdf.drawString(
        50,
        y,
        f"Тариф: {order.tariff.title}"
    )

    y -= 22

    pdf.drawString(
        50,
        y,
        f"Количество: {order.quantity}"
    )

    y -= 22

    pdf.drawString(
        50,
        y,
        f"Цена за единицу: {order.tariff.price_monthly} руб."
    )

    y -= 22

    pdf.drawString(
        50,
        y,
        f"Итоговая цена: {order.total_price} руб."
    )

    y -= 22

    pdf.drawString(
        50,
        y,
        f"Статус: {order.status}"
    )

    y -= 50

    pdf.drawString(
        50,
        y,
        "Спасибо за заказ!"
    )

    pdf.save()

    buffer.seek(0)

    filename = f"order_{order.id}.pdf"

    order.pdf_file.save(
        filename,
        ContentFile(buffer.read()),
        save=True,
    )