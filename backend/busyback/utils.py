from .models import *
import sys, traceback
import json

def create_normal(doc, content='', parent=None, location=0):
    return NormalBubble.objects.create(content=content, document=doc, location=location, parent_bubble=parent)

def create_suggest(bind, content):
    return SuggestBubble.objects.create(content=content, normal_bubble=bind, hidden=False)

def getCSRF(s):
    response = s.client.get('/api/token')
    return response.cookies['csrftoken'].value # Get csrf token from cookie

def http_send(s, t, url, jd={}, result=False, login=False, csrf=None):
    if login:
        s.client.login(username='testuser2', password='5678')
    response = None
    url = '/api/' + url
    if t != 'GET':
        csrf = getCSRF(s)
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
        response = s.client.delete(url, json.dumps(jd), content_type='application/json', HTTP_X_CSRFTOKEN=csrf)
    if result:
        s.result = json.loads(response.content.decode())
    return response.status_code

def see_error(e):
    print('***Traceback (most recent call last) ***')
    ex_type, ex, tb = sys.exc_info()
    traceback.print_tb(tb)
    print(type(e))
    print(str(e))
    print('****************************************')
    del tb
