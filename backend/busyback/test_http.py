from django.test import TestCase, Client
from .models import *
from .mock_db_setup import *
from .errors import *
from .users import *
from .utils import http_send, generate_hash
import json

class HttpTestCase(TestCase):

    def setUp(self):
        user_mockDBsetup(self)

    def send(self, t, url, jd={}, result=False, login=False):
        return http_send(self, t, url, jd, result, login)

    def test_req_document(self):
        self.send('GET', 'documentlist/')
        self.send('GET', 'document/1')
        # create document and check title
        self.send('POST', 'documentlist', {'title': 'new_document'}, result=True, login=True)
        doc_id = self.result['id']
        self.send('GET', 'document/' + str(doc_id), {'document_id': doc_id})
        doc_title = self.result['title']
        self.assertEqual(doc_title, 'new_document')
        self.send('GET', 'documentlist', {'user_id': 1})
        self.send('DELETE', 'document/' + str(doc_id))
        self.assertEqual(404, self.send('GET', 'document/' + str(doc_id), {'document_id': doc_id}))
        self.assertEqual(405, self.send('DELETE', 'documentlist'))
        pass

    def test_req_document_contributors(self):
        self.send('GET', 'document/contributors/1')
        doc = Document.objects.create(title='test doc')
        doc.contributors.add(self.user2)
        doc.save()
        self.send('POST', 'document/contributors/' + str(doc.id), {'user_to_add': 'testuser1'}, login=True)
        
        salt = InvitationHash.objects.filter(document=doc).values()[0]['salt']
        self.send('GET', 'document/acceptinvitation/' + str(salt))
        self.send('GET', 'document/contributors/' + str(doc.id), result=True)
        self.assertEqual(404, self.send('GET', 'document/contributors/100'))
        self.assertEqual(404, self.send('POST', 'document/contributors/' + str(doc.id), {'user_to_add': 'qwerasdf'}))
        self.assertEqual(400, self.send('GET', 'document/acceptinvitation/1'))
        self.assertEqual(400, self.send('GET', 'document/acceptinvitation/' + generate_hash()))
        pass

    def test_req_note(self):
        doc = Document.objects.create(title='asdf')
        doc.contributors.add(self.user2)
        doc.save()
        self.send('POST', str(doc.id) + '/notelist', {'content': 'new note'}, login=True, result=True)
        note_id = self.result['id']
        self.send('GET', str(doc.id) + '/note/' + str(note_id), result=True)
        self.assertEqual(self.result['content'], 'new note')
        self.send('PUT', str(doc.id) + '/note/' + str(note_id), {'content': 'edit note'}, result=True)
        self.send('GET', str(doc.id) + '/note/' + str(note_id), result=True)
        self.assertEqual(self.result['content'], 'edit note')
        self.send('DELETE', str(doc.id) + '/note/' + str(note_id))
        self.assertEqual(404, self.send('GET',str(doc.id) +  '/note/' + str(note_id)))

