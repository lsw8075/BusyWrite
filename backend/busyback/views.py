from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie

from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse

from django.forms.models import model_to_dict

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

def jsonrequest(func):
    def wrapper(*args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        req_method = request.method
        req_data = json.loads(request.body.decode())
        try:
            result = func(req_method, req_data)
        except Exception as ee:
            print('****Unknown exception****')
            print(str(ee))
            print('****************')
            return HttpResponse(status=500)
        return 
    return wrapper

@jsonrequest
def req_document_list(method, data):
    user_id = data['user_id']

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

@jsonrequest
def req_document_detail(method, data):
    user_id = data['user_id']
    document_id = data['document_id']

    if method == 'GET':
        try:
            document = do_fetch_document(user_id, document_id)
        except:
            return HttpResponse(status=404)
        if not document.is_contributed_by(user_id):
            return HtttResponse(status=403)
        return document # id, title, contributors(id)
    else:
        return HttpResponseNotAllowed(['GET'])

@jsonrequest
def req_document_contributors(method, data):
    user_id = data['user_id']
    document_id = data['document_id']

    if method == 'GET':
        try:
            conusers = do_get_connected_users_document(user_id, document_id)
        except:
            return HttpResponse(status=404)
        return conusers # list of users
    else:
        return HttpResponseNotAllowed(['GET'])

@jsonrequest
def req_send_invitation(method, data):
    pass

@jsonrequest
def req_add_contributors(method, data):
    pass
