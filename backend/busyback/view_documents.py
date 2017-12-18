from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .documents import *
from .utils import see_error
from functools import wraps
import json

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

def req_document_list(request):
    (user_id, method, data) = parse_request(request)

    if method == 'GET':
        try:
            documents = do_fetch_documents(user_id)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return JsonResponse(documents, safe=False) # list of documents
    elif method == 'POST':
        try:
            created = do_create_document(user_id, data['title'])
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return JsonResponse(created, safe=False) # id, title, contributors(id), rootbubble_id
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def req_document_detail(request, document_id):
    (user_id, method, data) = parse_request(request)

    if method == 'GET':
        try:
            document = do_fetch_document(user_id, document_id)
        except DocumentDoesNotExistError:
            return HttpResponse(status=404)
        except Exception as e:
            see_error(e)
            raise
        return JsonResponse(document, safe=False) # id, title, contributors(id)
    elif method == 'DELETE':
        try:
            document = do_delete_document(user_id, document_id)
        except DocumentDoesNotExistError:
            return HttpResponse(status=404)
        except Exception as e:
            see_error(e)
            raise
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'DELETE'])

def req_document_contributors(request, document_id):
    (user_id, method, data) = parse_request(request)
    if method == 'GET':
        try:
            conusers = do_get_connected_users_document(user_id, document_id)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=400)
        return conusers # list of users
    elif method == 'POST':
        try:
            user_to_add = data['user_to_add']
            who = User.objects.get(username=user_to_add) 
            do_send_invitation_email(user_id, document_id, who.id)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def req_document_accept_invitation(request):
    (user_id, method, data) = parse_request(request)
    if method == 'GET':
        try:
            salt = request.GET['salt']
            if len(salt) < 56:
                return HttpResponse(status=400)
            do_add_contributor(salt_value)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=400)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
