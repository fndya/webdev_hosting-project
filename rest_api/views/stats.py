from django.db.models import Avg, Count
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from hosting.models import Server, Tariff, User


class PlatformStatsView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        stats = Tariff.objects.aggregate(
            average_tariff_price=Avg("price_monthly")
        )

        return Response({
            "users_count": User.objects.count(),
            "servers_count": Server.objects.count(),
            "active_tariffs_count": Tariff.objects.filter(
                is_active=True
            ).count(),
            "average_tariff_price": stats["average_tariff_price"],
        })