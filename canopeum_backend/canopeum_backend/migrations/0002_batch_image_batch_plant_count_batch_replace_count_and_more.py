# Generated by Django 5.0.3 on 2024-06-19 20:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('canopeum_backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='batch',
            name='image',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='canopeum_backend.asset'),
        ),
        migrations.AddField(
            model_name='batch',
            name='plant_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='batch',
            name='replace_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='batch',
            name='survived_count',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]