from .models import *
from .users import do_fetch_user
from .errors import *
from django.utils import timezone

def do_fetch_document(
    user_id: int,
    document_id: int
    ):
    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        raise DocumentDoesNotExistError(document_id)
    # except Document. 
    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, document)

    return document

def do_fetch_documents(
    user_id: int
    ):
    user = do_fetch_user(user_id)
    documents = Document.objects.filter(contributors=user).values()
    if len(documents) == 0:
        return []
    return list(documents)

def do_create_document(
    user_id: int,
    title: str
    ):

    user = do_fetch_user(user_id)
    
    document = Document.objects.create(title=title)
    
    document.contributors.add(user)

def do_fetch_contributors(
    user_id: int,
    document_id: int
    ):

    document = do_fetch_document(user_id, document_id)
    return list(document.contributors.all().values())
