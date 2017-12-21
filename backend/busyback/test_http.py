from django.test import TestCase, Client
from .models import *
from .mock_db_setup import *
from .errors import *
from .users import *
from .utils import http_send
import json

class HttpTestCase(TestCase):

    def setUp(self):
        user_mockDBsetup(self)

    def send(self, t, url, jd={}, result=False, login=False):
        return http_send(self, t, url, jd, result, login)

    def test_req_document(self):
        # create document and check title
        self.send('POST', 'documentlist', {'title': 'new_document'}, result=True, login=True)
        doc_id = self.result['id']
        self.send('GET', 'document', {'document_id': doc_id})
        doc_title = self.result['title']
        self.assertEqual(doc_title, 'new_document')
        self.send('GET', 'documentlist', {'user_id': 1})
        self.send('DELETE', 'document/' + str(doc_id))
        pass

    def test_req_document_contributors(self):
        doc = Document.objects.create(title='test doc')
        doc.contributors.add(self.user2)
        doc.save()
        self.send('POST', 'document/contributors/' + str(doc.id), {'user_to_add': 'testuser1'}, login=True)
        
        salt = InvitationHash.objects.filter(document=doc).values()[0]['salt']
        self.send('GET', 'document/acceptinvitation/' + str(salt))
        self.send('GET', 'document/contributors/' + str(doc.id), result=True)
        pass

    def test_req_note(self):
        doc = Document.objects.create(title='asdf')
        doc.contributors.add(self.user2)
        doc.save()
        self.send('POST', '1/notelist', {'content': 'new note'}, login=True, result=True)
        note_id = self.result['id']
        self.send('GET', '1/note/' + str(note_id), result=True)
        self.assertEqual(self.result['content'], 'new note')
        self.send('PUT', '1/note/' + str(note_id), {'content': 'edit note'}, result=True)
        self.send('GET', '1/note/' + str(note_id), result=True)
        self.assertEqual(self.result['content'], 'edit note')
        self.send('DELETE', '1/note/' + str(note_id))
        self.assertEqual(404, self.send('GET', '1/note/' + str(note_id)))

