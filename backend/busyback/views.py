from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie

from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse

from django.forms.models import model_to_dict
from .documents import *
from .utils import *

import json
import re

def signup(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            password = req_data['password']
            email = req_data['email']
            # validation through email
            if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
                return HttpResponse(status=400)
            if User.objects.filter(email=email).exists():
                return HttpResponse(status=400)
            username = email.split('@')[0]
            # check duplicated email
            User.objects.create_user(username=username, password=password, email=email)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def signin(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode())
            email = request_data['email']
            password = request_data['password']
            try:
                username = User.objects.get(email=email).username
            except User.DoesNotExist:
                return HttpResponse(status=401)
            user = authenticate(request, username = username, password = password)
            if user is None:
                return HttpResponse(status=401) # unauthorized
            else:
                login(request, user)
                return JsonResponse({'user_id': user.id})
        except Exception as e:
            see_error(e)
            return HttpResponse(status=400)
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

