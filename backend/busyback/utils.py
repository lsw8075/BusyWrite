from django.http import HttpResponse, HttpResponseNotAllowed
from .models import *
from django.forms.models import model_to_dict
import sys, traceback
import json
import hashlib, random

def create_normal(doc, content='', parent=None, location=0):
    return NormalBubble.objects.create(content=content, document=doc, location=location, parent_bubble=parent)

def create_suggest(bind, content):
    return SuggestBubble.objects.create(content=content, normal_bubble=bind, hidden=False)

def process_normal(bubble):
    ''' convert model to dict with proper child info '''
    result = model_to_dict(bubble)
    child_count = bubble.child_count()

    if child_count != 0:
        result['type'] = 'internal'
    else:
        result['type'] = 'leaf'

    child_list = []
    for i in range(0, child_count):
        child_list.append(0)
    for child in bubble.child_bubbles.all():
        child_list[child.location] = child.id

    result['child_bubbles'] = child_list

    del result['type']
    return result

def process_suggest(bubble):
    ''' covert model to dict '''
    return model_to_dict(bubble)

def process_comment(comment):
    return model_to_dict(comment)

def process_note(note):
    return model_to_dict(note)

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

def generate_hash():
   return hashlib.sha224(str(random.random()).encode()).hexdigest() 

def parse_request(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    req_user = request.user.id
    req_method = request.method
    if (req_method == 'POST') or (req_method == 'PUT'):
        req_data = json.loads(request.body.decode())
    else:
        req_data = None
    return (req_user, req_method, req_data)
