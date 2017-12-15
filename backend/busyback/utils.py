from .models import *

def create_normal(doc, content='', parent=None, location=0):
    return NormalBubble.objects.create(content=content, document=doc, location=location, parent_bubble=parent)

def create_suggest(bind, content):
    return SuggestBubble.objects.create(content=content, normal_bubble=bind, hidden=False)
