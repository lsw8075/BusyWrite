from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie

from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse

from django.forms.models import model_to_dict
from .documents import *

import json

def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        User.objects.create_user(username=username, password=password)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def signin(request):
    if request.method == 'POST':
        request_data = json.loads(request.body.decode())
        username = request_data['username']
        password = request_data['password']
        user = authenticate(request, username = username, password = password)
        if user is None:
            return HttpResponse(status=401) # unauthorized
        else:
            login(request, user)
            return JsonResponse({'user_id': user.id})
    else:
        return HttpResponseNotAllowed(['POST'])

def signout(request):
    if request.method == 'GET':
        logout(request)
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET'])

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

def docrequest(func):
    def wrapper(request):
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        req_user = request.user.id
        req_method = request.method
        if req_method != 'GET':
            req_data = json.loads(request.body.decode())
        else:
            req_data = request.GET.dict()
        try:
            result = func(req_user, req_method, req_data)
        except Exception as ee:
            print('****Unknown exception****')
            print(type(ee))
            print(str(ee))
            print('****************')
            return HttpResponse(status=500)
        return result
    return wrapper

@docrequest
def req_document_list(user_id, method, data):
    if method == 'GET':
        try:
            documents = do_fetch_documents(user_id)
        except:
            return HttpResponse(status=404)
        return JsonResponse(documents, safe=False) # list of documents
    elif method == 'POST':
        created = do_create_document(user_id, data['title'])
        return JsonResponse(created, safe=False) # id, title, contributors(id), rootbubble_id
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@docrequest
def req_document_detail(user_id, method, data):
    document_id = data['document_id']

    if method == 'GET':
        try:
            document = do_fetch_document(user_id, document_id)
        except:
            return HttpResponse(status=404)
        return JsonResponse(document, safe=False) # id, title, contributors(id)
    else:
        return HttpResponseNotAllowed(['GET'])

@docrequest
def req_document_contributors(user_id, method, data):
    document_id = data['document_id']

    if method == 'GET':
        try:
            conusers = do_get_connected_users_document(user_id, document_id)
        except:
            return HttpResponse(status=404)
        return conusers # list of users
    else:
        return HttpResponseNotAllowed(['GET'])

@docrequest
def req_send_invitation(method, data):
    pass

@docrequest
def req_add_contributors(method, data):
    pass
