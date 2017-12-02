from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .documents import *

class DocumentTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_do_fetch_document(self):
        with self.assertRaises(DocumentDoesNotExistError):
            do_fetch_document(self.user1.id, 100)

        with self.assertRaises(UserIsNotContributorError):
            do_fetch_document(self.user1.id, self.doc2.id)

        do_fetch_document(self.user1.id, self.doc1.id)
        pass

    def test_do_fetch_documents(self):
        do_fetch_documents(self.user1.id)
        do_fetch_documents(self.user4.id)
       
    def test_do_create_document(self):
        do_create_document(self.user1.id, 'Create Document')

    def test_do_fetch_contributors(self):
        cont = do_fetch_contributors(self.user1.id, self.doc1.id)
        self.assertEqual(cont[0]['id'], self.user1.id)

