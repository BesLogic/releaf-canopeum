# Generated by Django 5.0.3 on 2024-03-21 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('canopeum_backend', '0002_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='share_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='site',
            name='visitor_count',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]