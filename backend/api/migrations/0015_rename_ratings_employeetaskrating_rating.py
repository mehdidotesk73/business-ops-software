# Generated by Django 5.1.1 on 2024-10-23 03:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0014_employeeprofile_overall_rating_employeetaskrating"),
    ]

    operations = [
        migrations.RenameField(
            model_name="employeetaskrating",
            old_name="ratings",
            new_name="rating",
        ),
    ]