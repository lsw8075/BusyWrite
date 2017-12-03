from .models import *
from .users import do_fetch_user
from .errors import *
from django.utils import timezone
from django.db import transaction

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
    user = do_fetch_user(user_id)
    documents = Document.objects.filter(contributors=user).values()
    if len(documents) == 0:
        return []
    return list(documents)

@transaction.atomic
def do_create_document(
    user_id: int,
    title: str
    ):

    user = do_fetch_user(user_id)
    
    document = Document.objects.create(title=title)
    
    document.contributors.add(user)

@transaction.atomic
def do_fetch_contributors(
    user_id: int,
    document_id: int
    ):

    document = do_fetch_document(user_id, document_id)
    return list(document.contributors.all().values())
