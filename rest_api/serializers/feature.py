from rest_framework import serializers

from hosting.models import TariffFeature


class TariffFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TariffFeature
        fields = (
            "id",
            "title",
            "description",
        )