from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .documents import *
from .debug import print_bubble_tree
from .bubbles import fetch_normal

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
       
    def test_do_create_delete_document(self):
        new_doc = do_create_document(self.user1.id, 'Create Document')
        do_add_contributor(self.user2.id, new_doc['id'], 'asdf')
        do_add_contributor(self.user3.id, new_doc['id'], 'asdf')
        cont = do_fetch_contributors(self.user1.id, new_doc['id'])
        self.assertEqual(len(cont), 3)
        do_delete_document(self.user1.id, new_doc['id'])
        do_delete_document(self.user2.id, new_doc['id'])
        cont = do_fetch_contributors(self.user3.id, new_doc['id'])
        self.assertEqual(cont[0]['id'], self.user3.id)
        do_delete_document(self.user3.id, new_doc['id'])
        with self.assertRaises(DocumentDoesNotExistError):
            do_fetch_document(self.user1.id, new_doc['id'])
        
    def test_connected_users(self):
        do_clear_connected_users_document(self.user1.id, self.doc1.id)
        con = do_get_connected_users_document(self.user1.id, self.doc1.id)
        self.assertEqual(len(con), 0)
        do_user_connect_document(self.user1.id, self.doc1.id)
        do_user_connect_document(self.user2.id, self.doc1.id)
        con = do_get_connected_users_document(self.user1.id, self.doc1.id)
        self.assertEqual(con[0], self.user1.id)
        self.assertEqual(con[1], self.user2.id)
        do_user_disconnect_document(self.user1.id, self.doc1.id)
        con = do_get_connected_users_document(self.user1.id, self.doc1.id)
        self.assertEqual(con[0], self.user2.id)
        do_user_disconnect_document(self.user2.id, self.doc1.id)
        con = do_get_connected_users_document(self.user1.id, self.doc1.id)
        self.assertEqual(len(con), 0)

    def do_change_title_of_document(self):
        do_change_title_of_document(0, self.user1.id, self.doc1.id, 'Hello world')
