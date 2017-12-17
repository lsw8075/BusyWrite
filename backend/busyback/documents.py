from .models import *
from .users import fetch_user
from .errors import *
from .versions import *
from .utils import create_normal
from django.utils import timezone
from django.db import transaction
from django.core.cache import cache
from django.forms.models import model_to_dict
import json

def process_document(document):
    res = model_to_dict(document)
    res['contributors'] = [user.id for user in res['contributors']]
    return res

@transaction.atomic
def do_fetch_document(
    user_id: int,
    document_id: int
    ):
    return process_document(fetch_document_with_lock(user_id, document_id))

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
    document.save()
    root_bubble = create_normal(document)

    # preset contents
    t_title = '<h1 class=\"ql-align-center\">Title</h1>'
    t_subtitle = '<h3>Subtitle</h3>'
    t_author = '<p class=\"ql-align-right\">Authors</p>'
    t_introheader = '<h3>Introduction</h3>'
    t_introbody = '<p>Write your introduction here! </p>'
    t_body1header = '<h3>Body</h3>'
    t_body1body = '<p>Write your body here! </p>'
    t_body2header = '<h3>Another Body</h3>'
    t_body2body = '<p>Write your another body here! </p>'
    t_conclheader = '<h3>Conclusion</h3>'
    t_conclbody = '<p>Write your conclusion here! </p>'
    # preset bubbles
    header_bubble = create_normal(document, '', root_bubble, 0)
    main_bubble = create_normal(document, '', root_bubble, 1)
    title_bubble = create_normal(document, t_title, header_bubble, 0)
    subt_bubble = create_normal(document, t_subtitle, header_bubble, 1)
    author_bubble = create_normal(document, t_author, header_bubble, 2)
    intro_bubble = create_normal(document, '', main_bubble, 0)
    introheader_bubble = create_normal(document, t_introheader, intro_bubble, 0)
    introbody_bubble = create_normal(document, t_introbody, intro_bubble, 1)

    body1_bubble = create_normal(document, '', main_bubble, 1)
    body1header_bubble = create_normal(document, t_body1header, body1_bubble, 0)
    body1body_bubble = create_normal(document, t_body1body, body1_bubble, 1)
    body2_bubble = create_normal(document, '', main_bubble, 2)
    body2header_bubble = create_normal(document, t_body2header, body2_bubble, 0)
    body2body_bubble = create_normal(document, t_body2body, body2_bubble, 1)
    concl_bubble = create_normal(document, '', main_bubble, 3)
    conclheader_bubble = create_normal(document, t_conclheader, concl_bubble, 0)
    conclbody_bubble = create_normal(document, t_conclbody, concl_bubble, 1)

    res = process_document(document)
    res['rootbubble_id'] = root_bubble.id
    return res

@transaction.atomic
def do_add_contributor(
    user_id: int,
    document_id: int,
    hash_value
    ):
    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        raise DocumentDoesNotExistError(document_id)
    
    if not document.contributors.filter(id=user_id).exists():
        document.contributors.add(fetch_user(user_id))
    else:
        raise InvalidInvitationError()
    document.save()
    
@transaction.atomic
def do_delete_document(
    user_id: int,
    document_id: int
    ):
    document = fetch_document_with_lock(user_id, document_id)
    user = fetch_user(user_id)

    if document.contributors.filter(id=user_id).exists():
        document.contributors.remove(user)
    else:
        raise UserIsNotContributorError(user_id, document_id)

    if document.contributors.count() == 0:
        document.delete()
    else:
        document.save()

@transaction.atomic
def do_fetch_contributors(
    user_id: int,
    document_id: int
    ):

    document = fetch_document_with_lock(user_id, document_id)
    users = list(document.contributors.all().values())
    users = [{'id': user['id'], 'email': user['email']} for user in users]
    return users

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

    return get_latest_version_rid(document_id)

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

@transaction.atomic
@update_doc
def do_change_title_of_document(
    rversion,
    user_id,
    doc_id,
    new_title
    ):

    document = fetch_document_with_lock(user_id, doc_id)
    document.title = new_title
    document.save()
    return (Operation.CHANGE_TITLE, new_title)
