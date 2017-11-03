from django.contrib import admin
from .models import File, Document, Bubble, Comment, Note, Alarm

# Register your models here.
admin.site.register(File)
admin.site.register(Document)
admin.site.register(Bubble)
admin.site.register(Comment)
admin.site.register(Note)
admin.site.register(Alarm)