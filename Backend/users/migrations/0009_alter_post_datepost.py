# Generated by Django 4.2.10 on 2024-05-28 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_post_adminid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='datePost',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
