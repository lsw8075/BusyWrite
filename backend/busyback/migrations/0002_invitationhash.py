# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-18 03:34
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('busyback', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='InvitationHash',
            fields=[
                ('salt', models.CharField(max_length=56, primary_key=True, serialize=False)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitation_hashs', to='busyback.Document')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitation_hashs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
