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

