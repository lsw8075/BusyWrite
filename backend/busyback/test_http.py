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
        pass

    def test_req_send_invitation(self):
        pass

