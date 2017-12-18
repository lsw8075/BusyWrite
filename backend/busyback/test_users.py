from django.test import TestCase, Client
from .models import *
from .mock_db_setup import *
from .errors import *
from .users import *
from .utils import getCSRF, http_send
import json

class UsersTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_do_fetch_user(self):
        do_fetch_user(self.user1.id)
        with self.assertRaises(UserDoesNotExistError):
            do_fetch_user(100)

class Users2TestCase(TestCase):

    def setUp(self):
        user_mockDBsetup(self)

    def send(self, t, url, jd={}, result=False, login=False):
        return http_send(self, t, url, jd, result, login)

    def test_token(self):
        self.assertEqual(204, self.send('GET', 'token'))

        self.assertEqual(405, self.send('DELETE', 'token'))

    def test_signup(self):
        csrftoken = getCSRF(self)

        response = self.client.post('/api/signup', json.dumps({'username': 'testuser4', 'password': '5678', 'email': 'test@test.com'}), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201) # Pass csrf protection

        self.assertEqual(405, self.send('PUT', 'signup', {'username': 'testuser4', 'password': '5678', 'email': 'test@test.com'}))

    def test_signin(self):
        response = self.client.post('/api/signin', json.dumps({'username': 'testuser2', 'password': '5678', 'email': 'test@test.com'}), content_type='applicaton/json')
        
        self.assertEqual(200, response.status_code)
        self.assertEqual(json.loads(response.content.decode())['user_id'], self.user2.id)

        self.assertEqual(401, self.send('POST', 'signin', {'username': 'testuser2', 'password': '1234'}))

        self.assertEqual(405, self.send('PUT', 'signin', {'username': 'testuser2', 'password': '5678'}))

    def test_signout(self):
        self.assertEqual(200, self.send('GET', 'signout'))

        self.assertEqual(405, self.send('DELETE', 'signout'))

