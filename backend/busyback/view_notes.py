from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from channels import Channel, Group
from .documents import *
from .utils import see_error, parse_request
from .notes import *
from functools import wraps
import json

def req_note_list(request, document_id):
    (user_id, method, data) = parse_request(request)
    if method is None:
        return HttpResponse(status=401)
    if method == 'GET':
        try:
            notes = do_fetch_notes(user_id, document_id)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return JsonResponse(notes, safe=False)
    elif method == 'POST':
        try:
            note = do_create_note(user_id, document_id, data['content'])
        except ContentEmptyError:
            return HttpResponse(status=400)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return JsonResponse(note, safe=False)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def req_note_detail(request, document_id, note_id):
    (user_id, method, data) = parse_request(request)
    
    if method is None:
        return HttpResponse(status=401)
    if method == 'GET':
        try:
            note = do_fetch_note(user_id, document_id, note_id)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return JsonResponse(note, safe=False)
    elif method == 'PUT':
        try:
            note = do_edit_note(user_id, document_id, note_id, data['content'])
        except UserIsNotContributorError:
            return HttpResponse(status=400)
        except UserIsNotNoteOwnerError:
            return HttpResponse(status=400)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return JsonResponse(note, safe=False)
    elif method == 'DELETE':
        try:
            note = do_delete_note(user_id, document_id, note_id)
        except UserIsNotNoteOwnerError:
            return HttpResponse(status=400)
        except Exception as e:
            see_error(e)
            return HttpResponse(status=404)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE']) 
