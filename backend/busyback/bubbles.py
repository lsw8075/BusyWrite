from .models import *
from .users import do_fetch_user
from .errors import *
from django.utils import timezone

def create_normal(doc, content='', parent=None, location=0):
    return NormalBubble.objects.create(content=content, timestamp=timezone.now(), document=doc, location=location, parent_bubble=parent)

def create_suggest(bind, content):
    return SuggestBubble.objects.create(content=content, timestamp=timezone.now(), normal_bubble=bind, hidden=False)

def check_contributor(bubble, user_id):
    '''Check user is contributor of document'''
    document = None
    if isinstance(bubble, NormalBubble):
        document = bubble.document
    elif isinstance(bubble, SuggestBubble):
        document = bubble.normal_bubble.document

    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, document)

def do_fetch_normal_bubble(bubble_id: int):
    try:
        bubble = NormalBubble.objects.get(id=bubble_id)
    except NormalBubble.DoesNotExist:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble

def do_fetch_suggest_bubble(bubble_id: int):
    try:
        bubble = SuggestBubble.objects.get(id=bubble_id)
    except SuggestBubble.DoesNotExist:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble


def do_fetch_bubbles(document_id: int):
    try:
        document = Document.objects.get(id=document_id)
        bubbles = NormalBubble.objects.filter(document=document).values()
    except Bubble.DoesNotExist:
        raise InternalError('Document has no bubble')
    return list(bubbles)

def get_root_bubble(document_id: int):
    '''Get root bubble of a document'''
    pass
'''
    try:
        bubbles = Bubble.objects.filter(id=document_id).all()
    except:
        raise InternalError('Document has no bubble')
    bubbles.filter(parent)
'''

def do_create_normal_bubble(
    user_id: int,
    parent_id: int,
    location: int,
    is_owned: bool,
    content: str
    ):
    '''Create a leaf bubble'''

    parent_bubble = do_fetch_normal_bubble(parent_id)
    user = do_fetch_user(user_id)
    check_contributor(parent_bubble, user_id)

    # check location is valid
    child_count = parent_bubble.child_count()
    if location < 0 or child_count < location:
        raise InvalidLocationError(parent_bubble, location)

    new_bubble = create_normal(parent_bubble.document, content, parent_bubble, location)

    new_bubble.edit_lock_holder = user
    new_bubble.owner_with_lock = None
    if is_owned:
       new_bubble.owner_with_lock = user

    parent_bubble.insert_children(location, [new_bubble])

    return new_bubble

def do_create_suggest_bubble(
    user_id: int,
    binded_id: int,
    content: str
    ):
    '''Create a suggest bubble'''

    binded_bubble = do_fetch_normal_bubble(binded_id)

    check_contributor(binded_bubble, user_id)

    new_suggest = create_suggest(binded_bubble, content)

    new_suggest.save()

    return new_suggest

def do_edit_normal_bubble(
    user_id: int,
    bubble_id: int,
    content: str
    ):
    '''Edit content of the leaf bubble'''
 
    bubble = do_fetch_normal_bubble(bubble_id)

    check_contributor(bubble, user_id)
    
    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble)
    
    user = do_fetch_user(user_id)
    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble)

    bubble.change_content(content)

def do_move_normal_bubble(
    user_id: int,
    bubble_id: int,
    new_parent_id: int,
    new_location: int
    ):
    '''Move the normal bubble to another site'''
    
    bubble = do_fetch_normal_bubble(bubble_id)
    new_parent = do_fetch_normal_bubble(new_parent_id)


    check_contributor(bubble, user_id)
    
    if bubble.is_root():
        raise BubbleIsRootError(bubble)

    if bubble.document.id != new_parent.document.id:
        raise NotInSameDocumentError(bubble, new_parent)

    if bubble.has_locked_ancestors():
        raise BubbleLockedError(bubble)
    
    user = do_fetch_user(user_id)
    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble)

    if new_parent.is_locked():
        raise BubbleLockedError(new_parent)
    
    user = do_fetch_user(user_id)
    if new_parent.owned_by_other(user):
        raise BubbleOwnedError(new_parent)

    old_parent = bubble.parent_bubble
    old_parent.splice_children(bubble.location, 1, new_parent, new_location)

def cascaded_delete_children(user, bubble):
    for child in bubble.child_bubbles.all():
        if child.owned_by_other(user):
            raise BubbleOwnedError(bubble)
        cascaded_delete_children(user, child)
        bubble.delete_children(child.location, 1)

def do_delete_normal_bubble(
    user_id: int,
    bubble_id: int
    ):
    '''Delete the normal bubble'''

    bubble = do_fetch_normal_bubble(bubble_id)

    check_contributor(bubble, user_id)

    if bubble.is_root():
        raise BubbleIsRootError(bubble)

    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble)

    
    user = do_fetch_user(user_id)
    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble)

    cascaded_delete_children(user, bubble)
    parent = bubble.parent_bubble
    parent.delete_children(bubble.location, 1)

def do_hide_suggest_bubble(
    user_id: int,
    bubble_id: int
    ):

    bubble = do_fetch_suggest_bubble(bubble_id)

    check_contributor(bubble, user_id)

    bubble.hide()


def do_show_suggest_bubble(
    user_id: int,
    bubble_id: int
    ):

    bubble = do_fetch_suggest_bubble(bubble_id)

    check_contributor(bubble, user_id)

    bubble.show()


def do_wrap_normal_bubble(
    user_id: int,
    bubble_id_list: list
    ):
    '''Wrap the normal bubbles'''

    if len(bubble_id_list) <= 1:
        raise InvalidWrapError()

    bubbles = []

    for bubble_id in bubble_id_list:
        bubble = do_fetch_normal_bubble(bubble_id)
        bubbles.append(bubble)

    parent = bubbles[0].parent_bubble

    check_contributor(bubbles[0], user_id)

    # check all bubbles sharing one parent
    for bubble in bubbles:
        if parent.id != bubble.parent_bubble.id:
            raise InvalidWrapError()

    # check adjacency
    bubble_locs = []

    for bubble in bubbles:
        bubble_locs.append(bubble.location)

    bubble_locs.sort()

    for idx in range(0, len(bubble_locs) - 1):
        if bubble_locs[idx+1] - bubble_locs[idx] != 1:
            raise InvalidWrapError()

    parent.wrap_children(bubble_locs[0], len(bubble_locs))


def do_pop_normal_bubble(
    user_id: int,
    bubble_id: list
    ):
    '''Pop the normal bubble'''

    bubble = do_fetch_normal_bubble(bubble_id)

    check_contributor(bubble, user_id)

    if bubble.is_root():
        raise BubbleIsRootError(bubble)

    if bubble.is_locked() or bubble.has_locked_descendants():
        raise BubbleLockedError(bubble)

    if bubble.is_leaf():
        raise BubbleIsLeafError(bubble)

    parent = bubble.parent_bubble
    parent.pop_child(bubble.location)



flatten_content = ''

def cascaded_flatten_children(user, bubble):
    for child in bubble.child_bubbles.all():
        if child.owned_by_other(user):
            raise BubbleOwnedError()
        cascaded_flatten_children(user, child)
        bubble.delete_children(child.location, 1)
    flattened_content = flatten_content + bubble.content

def do_flatten_normal_bubble(
    user_id: int,
    bubble_id: list
    ):
    '''Flatten the normal bubble'''

    bubble = do_fetch_normal_bubble(bubble_id)

    check_contributor(bubble, user_id)

    if bubble.is_locked() or bubble.has_locked_descendants():
        raise BubbleLockedError(bubble)

    if bubble.is_leaf():
        raise BubbleIsLeafError(bubble)

    flatten_content = ''


    user = do_fetch_user(user_id)
    cascaded_flatten_children(user, bubble)

    bubble.change_content(flatten_content)


'''
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


'''
