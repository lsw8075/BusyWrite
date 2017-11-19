from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .users import *

class UsersTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_do_fetch_user(self):
        do_fetch_user(self.user1.id)
        with self.assertRaises(UserDoesNotExistError):
            do_fetch_user(100)
