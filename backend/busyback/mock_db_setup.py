from .models import *
from datetime import datetime

def mockDBSetup(m):    
    m.user1 = User.objects.create_user(username='testuser1', email='test1@test.com', password='1234')
    m.user2 = User.objects.create_user(username='testuser2', email='test2@test.com', password='5678')
    m.user3 = User.objects.create_user(username='testuser3', email='test3@test.com', password='9090')

    m.doc1 = Document.objects.create(title='TestDoc1')
    m.doc2 = Document.objects.create(title='TestDoc2')
    m.doc1.contributors.add(m.user1)
    m.doc1.contributors.add(m.user2)
    m.doc2.contributors.add(m.user2)
