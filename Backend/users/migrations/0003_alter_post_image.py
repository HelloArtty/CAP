# Generated by Django 4.2.10 on 2024-05-23 05:09

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_post_adminid_alter_post_categoryid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=cloudinary.models.CloudinaryField(max_length=255, verbose_name='image'),
        ),
    ]
