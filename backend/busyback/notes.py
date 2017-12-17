from .models import *
from .bubbles import process_normal, process_suggest, normal_operation, suggest_operation
from .comments import process_comment
from .versions import update_doc
from .operation_no import Operation
from .utils import create_normal, create_suggest
from .users import fetch_user

def fetch_note(note_id):
    try:
        note = Note.objects.get(id=note_id)
    except Note.DoesNotExist:
        raise NoteDoesNotExistError(note_id)
    return note

@normal_operation
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
