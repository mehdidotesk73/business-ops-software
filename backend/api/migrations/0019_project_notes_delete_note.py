# Generated by Django 5.1.1 on 2024-10-27 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0018_employeetaskrating_performed_count_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="notes",
            field=models.CharField(max_length=2000, null=True),
        ),
        migrations.DeleteModel(
            name="Note",
        ),
    ]
