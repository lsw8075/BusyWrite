from django.contrib import admin
from .models import Directory, Document, Note, Bubble, NormalBubble, SuggestBubble, Comment, News, Invitation, SharedLink, Notification

# Register your models here.
admin.site.register(Directory)
admin.site.register(Document)
admin.site.register(Note)
admin.site.register(Bubble)
admin.site.register(NormalBubble)
admin.site.register(SuggestBubble)
admin.site.register(Comment)
admin.site.register(News)
admin.site.register(Invitation)
admin.site.register(SharedLink)
admin.site.register(Notification)
