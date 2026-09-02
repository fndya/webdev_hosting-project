from django.db import migrations, models
import django.db.models.deletion


def copy_tariff_features(apps, schema_editor):
    TariffFeatureAssignment = apps.get_model(
        "hosting",
        "TariffFeatureAssignment",
    )

    db_alias = schema_editor.connection.alias

    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            "SELECT tariff_id, tarifffeature_id "
            "FROM hosting_tariff_features"
        )
        rows = cursor.fetchall()

    for tariff_id, feature_id in rows:
        TariffFeatureAssignment.objects.using(db_alias).create(
            tariff_id=tariff_id,
            feature_id=feature_id,
        )


class Migration(migrations.Migration):

    dependencies = [
        ("hosting", "0004_alter_image_url"),
    ]

    operations = [
        migrations.CreateModel(
            name="TariffFeatureAssignment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "feature",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tariff_assignments",
                        to="hosting.tarifffeature",
                        verbose_name="Характеристика",
                    ),
                ),
                (
                    "tariff",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="feature_assignments",
                        to="hosting.tariff",
                        verbose_name="Тариф",
                    ),
                ),
            ],
            options={
                "verbose_name": "Характеристика тарифа",
                "verbose_name_plural": "Характеристики тарифов",
                "unique_together": {("tariff", "feature")},
            },
        ),

        migrations.RunPython(
            copy_tariff_features,
            migrations.RunPython.noop,
        ),

        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AlterField(
                    model_name="tariff",
                    name="features",
                    field=models.ManyToManyField(
                        blank=True,
                        related_name="tariffs",
                        through="hosting.TariffFeatureAssignment",
                        to="hosting.tarifffeature",
                        verbose_name="Характеристики",
                    ),
                ),
            ],
        ),
    ]
