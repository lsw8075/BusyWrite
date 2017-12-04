# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-04 07:31
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Bubble',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('next_comment_order', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('order', models.IntegerField(default=-1)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('contributors', models.ManyToManyField(related_name='documents', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('order', models.IntegerField()),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='busyback.Document')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CommentUnderNormal',
            fields=[
                ('comment_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='busyback.Comment')),
            ],
            bases=('busyback.comment',),
        ),
        migrations.CreateModel(
            name='CommentUnderSuggest',
            fields=[
                ('comment_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='busyback.Comment')),
            ],
            bases=('busyback.comment',),
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('news_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='busyback.News')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitations', to=settings.AUTH_USER_MODEL)),
            ],
            bases=('busyback.news',),
        ),
        migrations.CreateModel(
            name='NormalBubble',
            fields=[
                ('bubble_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='busyback.Bubble')),
                ('location', models.IntegerField(null=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bubbles', to='busyback.Document')),
                ('edit_lock_holder', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='editing_bubbles', to=settings.AUTH_USER_MODEL)),
                ('owner_with_lock', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='owning_bubbles', to=settings.AUTH_USER_MODEL)),
                ('parent_bubble', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='child_bubbles', to='busyback.NormalBubble')),
            ],
            bases=('busyback.bubble',),
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('news_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='busyback.News')),
                ('notitype', models.IntegerField()),
                ('who', models.TextField()),
            ],
            bases=('busyback.news',),
        ),
        migrations.CreateModel(
            name='SharedLink',
            fields=[
                ('news_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='busyback.News')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shared_links', to=settings.AUTH_USER_MODEL)),
            ],
            bases=('busyback.news',),
        ),
        migrations.CreateModel(
            name='SuggestBubble',
            fields=[
                ('bubble_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='busyback.Bubble')),
                ('hidden', models.BooleanField()),
                ('normal_bubble', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='suggest_bubbles', to='busyback.NormalBubble')),
            ],
            bases=('busyback.bubble',),
        ),
        migrations.AddField(
            model_name='news',
            name='document',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='news', to='busyback.Document'),
        ),
        migrations.AddField(
            model_name='news',
            name='receiver',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='news', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='comment',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='bubble',
            name='voters',
            field=models.ManyToManyField(related_name='voted_bubbles', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='commentundersuggest',
            name='bubble',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='busyback.SuggestBubble'),
        ),
        migrations.AddField(
            model_name='commentundernormal',
            name='bubble',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='busyback.NormalBubble'),
        ),
    ]
