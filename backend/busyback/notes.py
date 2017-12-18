from .models import *
from .bubbles import process_normal, process_suggest, normal_operation, suggest_operation
from .comments import process_comment
from .versions import update_doc
from .operation_no import Operation
from .utils import create_normal, create_suggest, process_note
from .users import fetch_user
from django.forms.models import model_to_dict
from functools import wraps
from .documents import fetch_document_with_lock

def fetch_note(note_id):
    try:
        note = Note.objects.get(id=note_id)
    except Note.DoesNotExist:
        raise NoteDoesNotExistError(note_id)
    return note

def note_operation(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('called ' + func.__name__ + '...')
        with transaction.atomic():
            user_id = args[0]
            doc_id = args[1]
            document = fetch_document_with_lock(user_id, doc_id)
            result = func(*args, document=document)
        return result
    return wrapper
    
@note_operation
def do_create_note(
    user_id: int,
    document_id: int,
    content: int,
    **kw
    ):
    
    if len(content) == 0:
        raise ContentEmptyError()

    user = fetch_user(user_id)
    document = kw['document']
    note = Notes.objects.create(document=document, owner=user, content=content, order=0)
    note.order = notes.id
    note.save()
    return process_note(note)

@note_operation
def do_edit_note(
    user_id: int,
    document_id: int,
    note_id: int,
    content: int,
    **kw
    ):

    if len(content) == 0:
        raise ContentEmptyError()

    document = kw['document']
    try:
        note = Notes.objetcts.get(id=note_id)
    except Exception as e:
        raise NoteDoesNotExistError(note_id)

    if note.owner.id != user_id:
        raise UserIsNotNoteOwnerError(user_id, note_id)

    note.content = content
    note.save()

    return process_note(note)

def do_delete_note(
    user_id: int,
    document_id: int,
    note_id: int,
    content: int
    ):

    user = fetch_user(user_id)
    try:
        note = Notes.objetcts.get(id=note_id)
    except Exception as e:
        raise NoteDoesNotExistError(note_id)


    if note.owner.id != user_id:
        raise UserIsNotNoteOwnerError(user_id, note_id)

    note.delete()

@normal_operation
@update_doc
def do_export_note_to_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    parent_id: int,
    location: int,
    note_id: int,
    **kw
    ):

    parent_bubble = kw['bubble']

    # check location is valid
    child_count = parent_bubble.child_count()
    if location < 0 or child_count < location:
        raise InvalidLocationError(parent_bubble.id, location)

    # check parent is leaf, locked

    if parent_bubble.is_leaf():
        raise BubbleIsLeafError(parent_bubble)

    note = fetch_note(note_id)
    if note.owner.id != user_id:
        raise UserIsNotNoteOwnerError(note.owner.id, user_id)
    content = note.content

    new_bubble = create_normal(parent_bubble.document, content, parent_bubble, location)
    parent_bubble.insert_children(location, [new_bubble])

    return (Operation.EXPORT_NOTE_TO_NORMAL, process_normal(new_bubble))

@normal_operation
@update_doc
def do_export_note_to_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    note_id: int,
    **kw
    ):
    
    note = fetch_note(note_id)
    if note.owner.id != user_id:
        raise UserIsNotNoteOwnerError(note.owner.id, user_id)
    content = note.content

    binded_bubble = kw['bubble']
    
    if binded_bubble.is_root():
        raise BubbleIsRootError(binded_bubble.id)

    new_suggest = create_suggest(binded_bubble, content)
    new_suggest.save()
    
    return (Operation.EXPORT_NOTE_TO_SUGGEST, process_suggest(new_suggest))

@normal_operation   
@update_doc
def do_export_note_to_comment_under_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    normal_id: int,
    note_id: int,
    **kw
    ):

    user = fetch_user(user_id)
    note = fetch_note(note_id)
    if note.owner.id != user_id:
        raise UserIsNotNoteOwnerError(note.owner.id, user_id)
    content = note.content
    
    bubble = kw['bubble']
    order = bubble.next_comment_order
    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)


    new_comment = CommentUnderNormal.objects.create(content=content, owner=user, bubble=bubble, order=order)
    bubble.next_comment_order += 1
    bubble.save()

    return (Operation.EXPORT_NOTE_TO_NCOMMENT, process_comment(new_comment))

@suggest_operation
@update_doc
def do_export_note_to_comment_under_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    suggest_id: int,
    note_id: int,
    **kw
    ):
    user = fetch_user(user_id)
    note = fetch_note(note_id)
    if note.owner.id != user_id:
        raise UserIsNotNoteOwnerError(note.owner.id, user_id)
    content = note.content
    
    bubble = kw['bubble']
    order = bubble.next_comment_order

    new_comment = CommentUnderSuggest.objects.create(content=content, owner=user, bubble=bubble, order=order)
    bubble.next_comment_order += 1
    bubble.save()

    return (Operation.EXPORT_NOTE_TO_SCOMMENT, process_comment(new_comment))
