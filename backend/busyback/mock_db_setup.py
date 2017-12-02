from .models import *
from datetime import datetime
from .bubbles import create_normal, create_suggest

def mockDBSetup(m):    
    m.user1 = User.objects.create_user(username='testuser1', email='test1@test.com', password='1234')
    m.user2 = User.objects.create_user(username='testuser2', email='test2@test.com', password='5678')
    m.user3 = User.objects.create_user(username='testuser3', email='test3@test.com', password='9090')

    m.doc1 = Document.objects.create(title='TestDoc1')
    m.doc2 = Document.objects.create(title='TestDoc2')
    m.doc1.contributors.add(m.user1)
    m.doc1.contributors.add(m.user2)
    m.doc1.contributors.add(m.user3)
    m.doc2.contributors.add(m.user2)

    m.doc1root = create_normal(m.doc1)
    m.doc2root = create_normal(m.doc2)

    m.bubble1 = create_normal(m.doc1,'TestBubble1',m.doc1root,0)
    m.bubble2 = create_normal(m.doc1,'',m.doc1root,1)
    m.bubble3 = create_normal(m.doc1,'TestBubble2',m.doc1root,2)

    m.bubble4 = create_normal(m.doc1,'TestLeaf1',m.bubble2,0)
    m.bubble5 = create_normal(m.doc1,'TestLeaf2',m.bubble2,1)
    m.bubble6 = create_normal(m.doc1,'TestLeaf3',m.bubble2,2)

    m.suggest1 = create_suggest(m.bubble1,'TestSuggest1')
    m.suggest2 = create_suggest(m.bubble2,'TestSuggest2')
    m.suggest3 = create_suggest(m.bubble1,'TestSuggest3')

    m.bubble7 = create_normal(m.doc2,'TestBubble2-1',m.doc2root,0)
    m.bubble8 = create_normal(m.doc2,'TestBubble2-2',m.doc2root,1)
    m.suggest4 = create_suggest(m.bubble7,'TestSuggest4')

def reload_bubbles(m, reload_list=None):
    if reload_list is None:
        reload_list = [1,2,3,4,5,6,7,8]
    for no in reload_list:
        if no == 1:
            m.bubble1 = NormalBubble.objects.get(id=m.bubble1.id)
        elif no == 2:
            m.bubble2 = NormalBubble.objects.get(id=m.bubble2.id)
        elif no == 3:
            m.bubble3 = NormalBubble.objects.get(id=m.bubble3.id)
        elif no == 4:
            m.bubble4 = NormalBubble.objects.get(id=m.bubble4.id)
        elif no == 5:
            m.bubble5 = NormalBubble.objects.get(id=m.bubble5.id)
        elif no == 6:
            m.bubble6 = NormalBubble.objects.get(id=m.bubble6.id)
        elif no == 7:
            m.bubble7 = NormalBubble.objects.get(id=m.bubble7.id)
        elif no == 8:
            m.bubble8 = NormalBubble.objects.get(id=m.bubble8.id)

def reload_suggests(m, reload_list=None):
    if reload_list is None:
        reload_list = [1, 2, 3]
    for no in reload_list:
        if no == 1:
            m.suggest1 = SuggestBubble.objects.get(id=m.suggest1.id)
        elif no == 2:
            m.suggest2 = SuggestBubble.objects.get(id=m.suggest2.id)
        elif no == 3:
            m.suggest3 = SuggestBubble.objects.get(id=m.suggest3.id)
