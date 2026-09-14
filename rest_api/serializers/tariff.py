from rest_framework import serializers

from hosting.models import (
    Image,
    Tariff,
    TariffFeature,
    TariffFeatureAssignment,
)


class TariffFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TariffFeature
        fields = (
            "id",
            "title",
            "description",
        )


class TariffSerializer(serializers.ModelSerializer):
    features = TariffFeatureSerializer(
        many=True,
        read_only=True,
    )

    feature_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=TariffFeature.objects.all(),
        source="features",
        write_only=True,
        required=False,
    )

    image_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Image.objects.all(),
        source="images",
        write_only=True,
        required=False,
    )

    image_urls = serializers.SerializerMethodField()

    new_image = serializers.ImageField(
        write_only=True,
        required=False,
    )

    created_by = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    updated_by = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = Tariff
        fields = (
            "id",
            "title",
            "description",
            "cpu_cores",
            "ram_gb",
            "storage_gb",
            "traffic",
            "price_monthly",
            "is_recommended",
            "is_active",
            "features",
            "feature_ids",
            "image_ids",
            "image_urls",
            "new_image",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        )

    def get_image_urls(self, obj):
        request = self.context.get("request")

        result = []

        for image in obj.images.all():
            if image.url:
                result.append(image.url)
            elif image.image_file:
                if request:
                    result.append(
                        request.build_absolute_uri(
                            image.image_file.url
                        )
                    )
                else:
                    result.append(image.image_file.url)

        return result

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Название тарифа не может быть пустым."
            )

        return value

    def validate_cpu_cores(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Количество ядер CPU должно быть больше нуля."
            )

        return value

    def validate_ram_gb(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Объём оперативной памяти должен быть больше нуля."
            )

        return value

    def validate_storage_gb(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Объём диска должен быть больше нуля."
            )

        return value

    def validate_price_monthly(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Цена не может быть отрицательной."
            )

        return value

    def _save_new_image(self, tariff, image_file):
        request_user = self.context.get("request_user")

        image = Image.objects.create(
            image_file=image_file,
            image_type="tariff",
            uploaded_by=request_user,
        )

        image.alt_text = f"Изображение тарифа {image.id}"
        image.save(
            update_fields=["alt_text"]
        )

        tariff.images.add(image)

    def create(self, validated_data):
        features = validated_data.pop(
            "features",
            []
        )

        images = validated_data.pop(
            "images",
            []
        )

        new_image = validated_data.pop(
            "new_image",
            None
        )

        request_user = self.context.get(
            "request_user"
        )

        tariff = Tariff.objects.create(
            created_by=request_user,
            updated_by=request_user,
            **validated_data,
        )

        for feature in features:
            TariffFeatureAssignment.objects.create(
                tariff=tariff,
                feature=feature,
            )

        tariff.images.set(images)

        if new_image:
            self._save_new_image(
                tariff,
                new_image,
            )

        return tariff

    def update(self, instance, validated_data):
        features = validated_data.pop(
            "features",
            None
        )

        images = validated_data.pop(
            "images",
            None
        )

        new_image = validated_data.pop(
            "new_image",
            None
        )

        request_user = self.context.get(
            "request_user"
        )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = request_user
        instance.save()

        if features is not None:
            instance.feature_assignments.all().delete()

            for feature in features:
                TariffFeatureAssignment.objects.create(
                    tariff=instance,
                    feature=feature,
                )

        if images is not None:
            instance.images.set(images)

        if new_image:
            self._save_new_image(
                instance,
                new_image,
            )

        return instance