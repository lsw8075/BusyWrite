from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .users import *

import json

class UsersTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_do_fetch_user(self):
        do_fetch_user(self.user1.id)
        with self.assertRaises(UserDoesNotExistError):
            do_fetch_user(100)


class SignInTestCase(TestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1', email='test1@test.com', password='1234')
        self.user2 = User.objects.create_user(username='testuser2', email='test2@test.com', password='5678')
        self.user3 = User.objects.create_user(username='testuser3', email='test3@test.com', password='9090')

    def getCSRF(self):
        response = self.client.get('/api/token')
        return response.cookies['csrftoken'].value # Get csrf token from cookie

    def send(self, t, url, jd={}, result=False, login=False):
        if login:
            self.client.login(username='testuser2', password='5678')
        response = None
        url = '/api/' + url
        if t != 'GET':
            csrf = self.getCSRF()
        if t == 'GET':
            response = self.client.get(url)
        elif t == 'POST':
            response = self.client.post(url, json.dumps(jd), content_type='application/json', HTTP_X_CSRFTOKEN=csrf)
        elif t == 'PUT':
            response = self.client.put(url, json.dumps(jd), content_type='application/json', HTTP_X_CSRFTOKEN=csrf)
        elif t == 'DELETE':
            response = self.client.delete(url, HTTP_X_CSRFTOKEN=csrf)
        if result:
            self.result = json.loads(response.content.decode())
        return response.status_code

    def test_token(self):
        self.assertEqual(204, self.send('GET', 'token'))

        self.assertEqual(405, self.send('DELETE', 'token'))

    def test_signup(self):
        csrftoken = self.getCSRF()

        response = self.client.post('/api/signup', json.dumps({'username': 'testuser4', 'password': '5678'}), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201) # Pass csrf protection

        self.assertEqual(405, self.send('PUT', 'signup', {'username': 'testuser4', 'password': '5678'}))

    def test_signin(self):
        self.assertEqual(200, self.send('POST', 'signin', {'username': 'testuser2', 'password': '5678'}))

        self.assertEqual(401, self.send('POST', 'signin', {'username': 'testuser2', 'password': '1234'}))

        self.assertEqual(405, self.send('PUT', 'signin', {'username': 'testuser2', 'password': '5678'}))

    def test_signout(self):
        self.assertEqual(200, self.send('GET', 'signout'))

        self.assertEqual(405, self.send('DELETE', 'signout'))
