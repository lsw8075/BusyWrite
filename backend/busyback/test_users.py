from django.test import TestCase, Client
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .users import *

import json

def http_send(s, t, url, jd={}, result=False, login=False, csrf=None):
    if login:
        s.client.login(username='testuser2', password='5678')
    response = None
    url = '/api/' + url
    if t != 'GET':
        csrf = s.getCSRF()
    if t == 'GET':
        if jd != {}:
            response = s.client.get(url, jd)
        else:
            response = s.client.get(url)
    elif t == 'POST':
        response = s.client.post(url, json.dumps(jd), content_type='application/json', HTTP_X_CSRFTOKEN=csrf)
    elif t == 'PUT':
        response = s.client.put(url, json.dumps(jd), content_type='application/json', HTTP_X_CSRFTOKEN=csrf)
    elif t == 'DELETE':
        response = s.client.delete(url, HTTP_X_CSRFTOKEN=csrf)
    if result:
        s.result = json.loads(response.content.decode())
    return response.status_code

class UsersTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_do_fetch_user(self):
        do_fetch_user(self.user1.id)
        with self.assertRaises(UserDoesNotExistError):
            do_fetch_user(100)


class HttpRequestTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='testuser1', email='test1@test.com', password='1234')
        self.user2 = User.objects.create_user(username='testuser2', email='test2@test.com', password='5678')
        self.user3 = User.objects.create_user(username='testuser3', email='test3@test.com', password='9090')

    def getCSRF(self):
        response = self.client.get('/api/token')
        return response.cookies['csrftoken'].value # Get csrf token from cookie

    def send(self, t, url, jd={}, result=False, login=False):
        return http_send(self, t, url, jd, result, login, self.getCSRF())

    def test_token(self):
        self.assertEqual(204, self.send('GET', 'token'))

        self.assertEqual(405, self.send('DELETE', 'token'))

    def test_signup(self):
        csrftoken = self.getCSRF()

        response = self.client.post('/api/signup', json.dumps({'username': 'testuser4', 'password': '5678'}), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201) # Pass csrf protection

        self.assertEqual(405, self.send('PUT', 'signup', {'username': 'testuser4', 'password': '5678'}))

    def test_signin(self):
        response = self.client.post('/api/signin', json.dumps({'username': 'testuser2', 'password': '5678'}), content_type='applicaton/json')
        
        self.assertEqual(200, response.status_code)
        self.assertEqual(json.loads(response.content.decode())['user_id'], self.user2.id)

        self.assertEqual(401, self.send('POST', 'signin', {'username': 'testuser2', 'password': '1234'}))

        self.assertEqual(405, self.send('PUT', 'signin', {'username': 'testuser2', 'password': '5678'}))

    def test_signout(self):
        self.assertEqual(200, self.send('GET', 'signout'))

        self.assertEqual(405, self.send('DELETE', 'signout'))


    def test_req_document(self):
        # create document and check title
        self.send('POST', 'documentlist', {'title': 'new_document'}, result=True, login=True)
        doc_id = self.result['id']
        self.send('GET', 'document', {'document_id': doc_id})
        doc_title = self.result['title']
        self.assertEqual(doc_title, 'new_document')
        self.send('GET', 'documentlist', {'user_id': 1})

        pass

    def test_req_document_contributors(self):
        pass

    def test_req_send_invitation(self):
        pass

