from .models import *
from .users import fetch_user
from .errors import *
from .versions import *
from .utils import create_normal, generate_hash
from .utils import process_normal, process_suggest, process_comment, process_note
from django.utils import timezone
from django.db import transaction
from django.core.cache import cache
from django.forms.models import model_to_dict
from django.core.mail import EmailMessage
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
def do_send_invitation_email(
    user_id: int,
    document_id: int,
    who_id: int
    ):

    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        raise DocumentDoesNotExistError(document_id)
    
    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, doc_id)

    if document.contributors.filter(id=who_id).exists():
        raise InvalidInvitationError()
    
    user = fetch_user(user_id)
    who_to_send = fetch_user(who_id)
    salt = generate_hash()
    InvitationHash.objects.create(salt=salt, document=document, receiver=who_to_send)

    # generate mail body
    mail_subject = '[Busywrite] %s invited you to document \'%s\'' % (user.username, document.title)
    invite_route = 'invitation'
    invite_addr = 'http://busywrite.ribosome.kr/%s/%s' % (invite_route, salt)
    mail_body = '<h2>Busywrite invitation</h2> <p> click <a href=\"%s\">this link</a> to accept invitation </p>' % invite_addr
    # for debug.. please remove below code at practice!
    debug_addr = 'http://localhost:4200/%s/%s' % (invite_route, salt)
    mail_body = mail_body + '<p> invitation at debug: <a href=\"%s\">this link</a> to accept invitation </p>' % debug_addr
    # for debug.. please remove above code at practice!
    
    # send invitation mail
    email = EmailMessage(mail_subject, mail_body, 'no-reply@busywrite.ribosome.kr', to=[who_to_send.email])
    email.send(fail_silently=True)
    
    # this return is only for testing. http does not use the value
    return salt

@transaction.atomic
def do_add_contributor(salt_value):    
    try:
        invitation = InvitationHash.objects.get(salt=salt_value)
        document = invitation.document
        who = invitation.receiver
        invitation.delete()
    except InvitationHash.DoesNotExist:
        raise InvalidInvitaionError()

    if not document.contributors.filter(id=who.id).exists():
        document.contributors.add(who)
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

def fetch_contributors(document):
    users = list(document.contributors.all().values())
    users = [{'id': user['id'], 'username': user['username'], 'email': user['email']} for user in users]
    return users

@transaction.atomic
def do_fetch_contributors(
    user_id: int,
    document_id: int
    ):

    document = fetch_document_with_lock(user_id, document_id)
    return fetch_contributors(document)

def key_duser(document_id):
    return 'Duser' + str(document_id)

def do_user_connect_document(
    user_id: int,
    document_id: int
    ):
    key_doc = key_duser(document_id)
    
    with cache.lock('doclock' + str(document_id)):
        connected_users = cache.get_or_set(key_doc, '[]')
        cache.persist("key_doc")
        connected_users = json.loads(connected_users)
        if not user_id in connected_users:
            connected_users.append(user_id)
        connected_users = json.dumps(connected_users)

        cache.set(key_doc, connected_users, timeout=None)

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
            cache.set(key_doc, connected_users, timeout=None)
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
def do_change_title_of_document(
    rversion,
    user_id,
    doc_id,
    new_title
    ):

    document = fetch_document_with_lock(user_id, doc_id)
    document.title = new_title
    document.save()
    return (0, new_title)

# this function only called at opening document
# format:
# result[0] : all normal bubble's list
# result[1] : all suggest bubble's list
# result[2] : all comment under normal's list
# result[3] : all comment under suggest's list
# result[4] : all the notes
# result[5] : latest version request-id of document
# result[6] : all contributors of document
# result[7] : all connected contributors of document

@transaction.atomic
def do_fetch_whole_document(user_id, document_id):
    document = fetch_document_with_lock(user_id, document_id)
    result = [None] * 8

    user = fetch_user(user_id)

    # 0: all the normals
    bubbles = document.bubbles.all()
    if len(bubbles) == 0:
        raise InternalError('Document has no bubble')

    all_ncomments = []
    all_scomments = []
    all_suggests = []
    for bubble in bubbles:
        # collect comments
        ncomments = list(bubble.comments.all())
        ncomments = [process_comment(c) for c in ncomments]
        all_ncomments.extend(ncomments)
        suggests = list(bubble.suggest_bubbles.all())
        for suggest in suggests:
            scomments = list(suggest.comments.all())
            scomments = [process_comment(c) for c in scomments]
            all_scomments.extend(scomments)
        suggests = [process_suggest(b) for b in suggests]
        all_suggests.extend(suggests)

    notes = list(document.notes.filter(owner=user).all())
    notes = [process_note(n) for n in notes]

    bubbles = list(bubbles)
    bubbles = [process_normal(b) for b in bubbles]

    result[0] = bubbles
    result[1] = all_suggests
    result[2] = all_ncomments
    result[3] = all_scomments
    result[4] = notes
    result[5] = get_latest_version_rid(document.id)
    result[6] = fetch_contributors(document)
    result[7] = do_get_connected_users_document(user_id, document_id)

    return result
