from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from rest_api.serializers.feature import TariffFeatureSerializer

from hosting.models import TariffFeature


class TariffFeatureListView(ListAPIView):
    queryset = TariffFeature.objects.all()
    serializer_class = TariffFeatureSerializer
    permission_classes = (AllowAny,)