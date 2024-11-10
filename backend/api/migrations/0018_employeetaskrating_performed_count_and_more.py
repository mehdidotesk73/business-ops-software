# Generated by Django 5.1.1 on 2024-10-23 05:01

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0017_alter_employeetaskrating_employee_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="employeetaskrating",
            name="performed_count",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="employeetaskrating",
            name="recall_count",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="employeetaskrating",
            name="success_chance",
            field=models.FloatField(
                default=0,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(1),
                ],
            ),
        ),
    ]