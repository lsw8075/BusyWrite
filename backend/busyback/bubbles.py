from .models import *
from .users import do_fetch_user
from .errors import *
from datetime import datetime

def check_contributor(bubble, user):
    '''Check user is contributor of document'''
    document = bubble.document
    if not document.is_contributed_by(user):
        raise UserIsNotContributorError(user, document)

def do_fetch_bubble(bubble_id: int):
    '''Fetch one bubble with given id'''
    try:
        bubble = Bubble.objects.get(id=bubble_id)
    except Bubble.DoesNotExist:
        raise BubbleDoesNotExistError()
    return bubble

def do_fetch_bubbles(document_id: int):
    '''Fetch list of all bubbles in the document with given id'''
    try:
        bubbles = Bubble.objects.all().values()
    except Bubble.DoesNotExist:
        return None
    return list(bubbles)

def do_create_bubble(
    user_id: int,
    parent_id: int,
    location: int,
    is_owned: bool,
    content: str
    ):
    '''Create a leaf bubble'''

    parent_bubble = do_fetch_bubble(parent_id)
    user = do_fetch_user(user_id)

    check_contributor(parent_bubble, user)

    # check location is valid
    child_count = parent_bubble.child_count()
    if location < 0 or child_count < location:
        raise InvalidLocationError(parent_bubble, location)

    new_bubble = NormalBubble(content=content, timestamp=datetime.now(), document=document)

    new_bubble.edit_lock_holder = user
    new_bubble.owner_with_lock = None
    if is_owned:
       new_bubble.owner_with_lock = user

    # parent_bubble.insert_children(location, [new_bubble])

    new_bubble.save()
    parent_bubble.save()

def do_edit_bubble(
    user_id: int,
    bubble_id: int,
    content: str
    ):
    '''Edit content of the bubble'''
 
    bubble = do_fetch_bubble(bubble_id)
    user = do_fetch_user(user_id)

    check_contributor(user, bubble)
    
    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble)

    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble)

    bubble.content = content;
    bubble.save()

def do_move_bubble(
    user_id: int,
    bubble_id: int,
    new_parent_id: int,
    new_location, int
    ):
    '''Move the bubble to another site'''
    
    bubble = do_fecth_bubble(bubble_id)
    new_parent = do_fetch_bubble(new_parent_id)

    user = do_fetch_user(user_id)

    check_contributor(user, bubble)
    
    if bubble.is_root():
        pass

    if bubble.document != new_parent.document:
        raise NotInSameDocumentError(bubble, new_parent)

    if bubble.has_locked_ancestors():
        raise BubbleLockedError(bubble)

    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble)

    if new_parent.is_locked():
        raise BubbleLockedError(new_parent)

    if new_parent.owned_by_other(user):
        raise BubbleOwnedError(new_parent)

    old_parent = bubble.parent_bubble
    # old_parent.delete_children(bubble.location, 1)
    # new_parent.insert_children(new_location, [bubble])

    old_parent.save()
    bubble.save()
    new_parent.save()

def do_delete_bubble(
    user_id: int,
    bubble_id: int
    ):
    pass

def do_wrap_bubble(
    user_id: int,
    bubble_id_list: list
    ):
    pass

def do_pop_bubble(
    user_id: int,
    bubble_id: list
    ):
    pass

def do_split_leaf_bubble(
    user_id: int,
    bubble_id: int,
    split_content_list: list # list of string
    ):
    pass

def do_split_internal_bubble(
    user_id: int,
    bubble_id: int,
    split_location: list # list of int
    ):
    pass

def do_flatten_bubble(
    user_id: int,
    bubble_id: int
    ):
    pass
