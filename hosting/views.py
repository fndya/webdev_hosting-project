from django.db.models import Avg, Sum, Q
from django.shortcuts import render, get_object_or_404

from .models import Tariff, Server, User, Order, ContactRequest


def home(request):
    query = request.GET.get("q", "").strip()

    recommended_tariffs = (
        Tariff.objects
        .filter(is_active=True)
        .order_by("-is_recommended", "price_monthly")[:3]
    )

    latest_servers = (
        Server.objects
        .select_related("user", "tariff", "status")
        .order_by("-created_at")[:5]
    )

    latest_requests = (
        ContactRequest.objects
        .exclude(status="closed")
        .order_by("-created_at")[:3]
    )

    search_results = None

    if query:
        search_results = (
            Tariff.objects
            .filter(
                Q(title__icontains=query)
                | Q(description__icontains=query)
                | Q(traffic__icontains=query)
            )
            .filter(is_active=True)
            .distinct()
        )

    stats = {
        "users_count": User.objects.count(),
        "servers_count": Server.objects.count(),
        "active_tariffs_count": Tariff.objects.filter(is_active=True).count(),
        "orders_count": Order.objects.count(),
        "avg_price": Tariff.objects.aggregate(avg_price=Avg("price_monthly"))["avg_price"],
        "total_balance": User.objects.aggregate(total_balance=Sum("balance"))["total_balance"],
    }

    context = {
        "query": query,
        "recommended_tariffs": recommended_tariffs,
        "latest_servers": latest_servers,
        "latest_requests": latest_requests,
        "search_results": search_results,
        "stats": stats,
    }

    return render(request, "hosting/index.html", context)

def pricing(request):
    tariffs = Tariff.active.all()

    return render(request, "hosting/pricing.html", {
        "tariffs": tariffs,
    })

def tariff_detail(request, tariff_id):
    tariff = get_object_or_404(
        Tariff.objects.prefetch_related("features", "images"),
        id=tariff_id,
        is_active=True
    )

    return render(
        request,
        "hosting/tariff_detail.html",
        {"tariff": tariff}
    )