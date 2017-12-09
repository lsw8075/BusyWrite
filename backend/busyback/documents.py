from .models import *
from .users import fetch_user
from .errors import *
from django.utils import timezone
from django.db import transaction
from django.core.cache import cache
import json

@transaction.atomic
def do_fetch_document(
    user_id: int,
    document_id: int
    ):
    return fetch_document_with_lock(user_id, document_id)

def fetch_document_with_lock(user_id, document_id):
    try:
        document = Document.objects.select_for_update().get(id=document_id)
    except Document.DoesNotExist:
        raise DocumentDoesNotExistError(document_id)

    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, document)

    return document

@transaction.atomic
def do_fetch_documents(
    user_id: int
    ):
    user = fetch_user(user_id)
    documents = Document.objects.filter(contributors=user).values()
    if len(documents) == 0:
        return []
    return list(documents)

@transaction.atomic
def do_create_document(
    user_id: int,
    title: str
    ):

    user = fetch_user(user_id)
    
    document = Document.objects.create(title=title)
    
    document.contributors.add(user)

@transaction.atomic
def do_fetch_contributors(
    user_id: int,
    document_id: int
    ):

    document = do_fetch_document(user_id, document_id)
    return [d['id'] for d in list(document.contributors.all().values())]

def key_duser(document_id):
    return 'Duser' + str(document_id)

def do_user_connect_document(
    user_id: int,
    document_id: int
    ):
    key_doc = key_duser(document_id)
    
    with cache.lock('doclock' + str(document_id)):
        connected_users = cache.get_or_set(key_doc, '[]')
        connected_users = json.loads(connected_users)
        connected_users.append(user_id)
        connected_users = json.dumps(connected_users)

        cache.set(key_doc, connected_users)

    ## TODO : return rid of latest version
    return 0

def do_user_disconnect_document(
    user_id: int,
    document_id: int
    ):
    key_doc = key_duser(document_id)
    with cache.lock('doclock' + str(document_id)):
        connected_users = cache.get(key_doc)
        connected_users = json.loads(connected_users)
        connected_users.remove(user_id)
        if len(connected_users) > 0:
            connected_users = json.dumps(connected_users)
            cache.set(key_doc, connected_users)
        else:
            cache.delete(key_doc)

def do_get_connected_users_document(
    user_id: int,
    document_id: int
    ):

    key_doc = key_duser(document_id)
    with cache.lock('doclock' + str(document_id)):
        connected_users = cache.get(key_doc)
        if connected_users is None:
            return []
        connected_users = json.loads(connected_users)
        connected_users.sort()
        return connected_users

def do_clear_connected_users_document(
    user_id: int,
    document_id: int
    ):
    key_doc = key_duser(document_id)
    with cache.lock('doclock' + str(document_id)):
        connected_users = cache.get(key_doc)
        if connected_users is not None:
            cache.delete(key_doc)
