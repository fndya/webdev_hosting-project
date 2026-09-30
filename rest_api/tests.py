from django.test import TestCase
from rest_framework.exceptions import ValidationError

from hosting.models import Role, Tariff, User
from rest_api.serializers.tariff import TariffSerializer


class TariffSerializerTests(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name="admin")
        self.user = User.objects.create(
            role=self.role,
            name="Тестовый администратор",
            email="admin-test@example.com",
            password_hash="test-hash",
        )

        self.valid_data = {
            "title": "Тестовый тариф",
            "description": "Описание",
            "cpu_cores": 4,
            "ram_gb": 8,
            "storage_gb": 100,
            "traffic": "Безлимит",
            "price_monthly": "500.00",
        }

    def test_valid_tariff_data(self):
        serializer = TariffSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_title_is_trimmed(self):
        data = {
            **self.valid_data,
            "title": "  Тестовый тариф  ",
        }
        serializer = TariffSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(
            serializer.validated_data["title"],
            "Тестовый тариф",
        )

    def test_blank_title_is_invalid(self):
        data = {**self.valid_data, "title": "   "}
        serializer = TariffSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)

    def test_zero_cpu_cores_is_invalid(self):
        data = {**self.valid_data, "cpu_cores": 0}
        serializer = TariffSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("cpu_cores", serializer.errors)

    def test_zero_ram_is_invalid(self):
        data = {**self.valid_data, "ram_gb": 0}
        serializer = TariffSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("ram_gb", serializer.errors)

    def test_zero_storage_is_invalid(self):
        data = {**self.valid_data, "storage_gb": 0}
        serializer = TariffSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("storage_gb", serializer.errors)

    def test_negative_price_is_invalid(self):
        data = {**self.valid_data, "price_monthly": "-1.00"}
        serializer = TariffSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("price_monthly", serializer.errors)

    def test_zero_price_is_valid(self):
        data = {**self.valid_data, "price_monthly": "0.00"}
        serializer = TariffSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_negative_cpu_cores_is_invalid(self):
        data = {**self.valid_data, "cpu_cores": -1}
        serializer = TariffSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("cpu_cores", serializer.errors)


    def test_negative_ram_is_invalid(self):
        data = {**self.valid_data, "ram_gb": -1}
        serializer = TariffSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("ram_gb", serializer.errors)