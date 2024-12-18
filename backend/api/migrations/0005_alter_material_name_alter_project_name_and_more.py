# Generated by Django 5.1.1 on 2024-10-13 02:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_material_unit"),
    ]

    operations = [
        migrations.AlterField(
            model_name="material",
            name="name",
            field=models.CharField(max_length=200, unique=True),
        ),
        migrations.AlterField(
            model_name="project",
            name="name",
            field=models.CharField(max_length=200, unique=True),
        ),
        migrations.AlterField(
            model_name="task",
            name="name",
            field=models.CharField(max_length=200, unique=True),
        ),
    ]
