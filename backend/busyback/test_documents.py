from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .documents import *

class DocumentTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_do_fetch_document(self):
        pass

    def test_do_create_document(self):
        pass

    def test_do_delete_document(self):
        pass

    def test_check_contributor(self):
        pass

    def test_do_add_contributor(self):
        pass

    def test_do_fetch_contributors(self):
        pass

