from django.test import TestCase
from django.core import mail
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
        new_document = Document.objects.get(id=new_doc['id'])
        new_document.contributors.add(self.user2.id)
        new_document.contributors.add(self.user3.id)
        new_document.save()
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

    def test_do_change_title_of_document(self):
        do_change_title_of_document(0, self.user1.id, self.doc1.id, 'Hello world')

    def test_invitation_to_document(self):
        # clear mail box
        mail.outbox = []

        # user 1 create document 
        new_doc = do_create_document(self.user1.id, 'New Document')
        new_document = Document.objects.get(id=new_doc['id'])

        # send invitation email to user 2

        salt = do_send_invitation_email(self.user1.id, new_document.id, self.user2.id)

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject[0:11], '[Busywrite]')
        # add contributor when the mail arrives

        do_add_contributor(salt)
        cont = do_fetch_contributors(self.user1.id, new_document.id)
        self.assertEqual(len(cont), 2)


    def test_do_fetch_whole_document(self):
        result = do_fetch_whole_document(self.user1.id, self.doc1.id)
        #import json
        #print(json.dumps(result))

    
