from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from channels import Channel, Group
from .documents import *
from .utils import see_error, parse_request
import json


def req_document_list(request):
    (user_id, method, data) = parse_request(request)
    if method is None:
        return HttpResponse(status=401)

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
            return HttpResponse(status=400)
        return JsonResponse(created, safe=False) # id, title, contributors(id), rootbubble_id
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def req_document_detail(request, document_id):
    (user_id, method, data) = parse_request(request)
    if method is None:
        return HttpResponse(status=401)

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
    if method is None:
        return HttpResponse(status=401)
    if method == 'GET':
        try:
            conusers = do_fetch_contributors(user_id, document_id)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return JsonResponse(conusers, safe=False) # list of users
    elif method == 'POST':
        try:
            print('post arrived')
            user_to_add = data['user_to_add']
            who = User.objects.get(username=user_to_add) 
            do_send_invitation_email(user_id, document_id, who.id)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def req_document_accept_invitation(request, salt):
    (user_id, method, data) = parse_request(request)
    if method is None:
        return HttpResponse(status=401)
    if method == 'GET':
        try:
            if len(salt) < 56:
                return HttpResponse(status=400)
            result = do_add_contributor(salt)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=400)
        doc_id = result[0]
        who = result[1]
        Group('document_detail-'+str(doc_id)).send({"text":
            json.dumps({"header": "someone_added_as_contributor", "accept": "True",
                "body": {"id": who.id, "username": who.username, "email": who.email}})})
        print('sended jsonresponse %s' % doc_id)
        return JsonResponse({'document_id': doc_id}, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
