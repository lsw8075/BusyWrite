from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup

class DocumentModelTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_contributors(self):
        '''test is_contributed_by'''
        self.assertTrue(self.doc1.is_contributed_by(self.user1.id))
        self.assertFalse(self.doc2.is_contributed_by(self.user1.id))
