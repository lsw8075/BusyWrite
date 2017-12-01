from .models import *
from .errors import *
from .users import do_fetch_user
from .documents import do_fetch_document
from django.utils import timezone
from django.db import transaction

def create_normal(doc, content='', parent=None, location=0):
    return NormalBubble.objects.create(content=content, timestamp=timezone.now(), document=doc, location=location, parent_bubble=parent)

def create_suggest(bind, content):
    return SuggestBubble.objects.create(content=content, timestamp=timezone.now(), normal_bubble=bind, hidden=False)

def check_contributor(user_id, bubble):
    '''Check user is contributor of document which bubble is located'''
    document = bubble.document

    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, document.id)

def check_suggest_contributor(user_id, suggest):
    document = suggest.normal_bubble.document

    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, document.id)

def do_fetch_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):
    try:
        bubble = Bubble.objects.get(id=bubble_id)
    except Bubble.DoesNotExist:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble

def do_fetch_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):
    try:
        bubble = NormalBubble.objects.get(id=bubble_id)
        check_contributor(user_id, bubble)
    except NormalBubble.DoesNotExist:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble

def do_fetch_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):
    try:
        bubble = SuggestBubble.objects.get(id=bubble_id)
        check_suggest_contributor(user_id, bubble)
    except SuggestBubble.DoesNotExist:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble


def do_fetch_normal_bubbles(
    user_id: int,
    document_id: int
    ):
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, doc_id)
    bubbles = NormalBubble.objects.filter(document=document).values()
    if len(bubbles) == 0:
        raise InternalError('Document has no bubble')
    bubbles = list(bubbles)
    return bubbles

def do_fetch_bubbles(
    user_id: int,
    document_id: int
    ):
    return do_fetch_normal_bubbles(user_id, document_id)

def do_fetch_suggest_bubbles(
    user_id: int,
    document_id: int
    ):
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id):
        raise UserIsNotContributorError(user_id, doc_id)
    bubbles = NormalBubble.objects.filter(document=document)
    if len(bubbles) == 0:
        raise InternalError('Document %d has no bubble' % document_id)
    suggests = SuggestBubble.objects.filter(normal_bubble=bubbles).values()
    if len(suggests) == 0:
        return []
    suggests = list(suggests)
    return suggests
    
def get_root_bubble(
    user_id: int,
    document_id: int
    ):
    '''Get root bubble of a document'''
    try:
        root_bubble = NormalBubble.objects.filter(parent_bubble=None).get(id=document_id)
    except NormalBubble.MultipleObjectsReturned:
        raise InternalError('Document %d has multiple root bubble' % document_id)
    except NormalBubble.DoesNotExist:
        raise InternalError('Document %d has no root bubble' % document_id)
    check_contributor(user_id, root_bubble)
    return root_bubble

def do_create_normal_bubble(
    user_id: int,
    document_id: int,
    parent_id: int,
    location: int,
    is_owned: bool,
    content: str
    ):
    '''Create a leaf bubble'''

    parent_bubble = do_fetch_normal_bubble(user_id, document_id, parent_id)
    user = do_fetch_user(user_id)
    check_contributor(user_id, parent_bubble)

    # check location is valid
    child_count = parent_bubble.child_count()
    if location < 0 or child_count < location:
        raise InvalidLocationError(parent_bubble.id, location)

    # check parent is leaf, locked

#    if parent_bubble.is_leaf():
#        raise BubbleIsLeafError(parent_bubble)

    if parent_bubble.has_locked_ancestors() or parent_bubble.is_locked():
        raise BubbleLockedError(parent_bubble.id)

    # create a bubble
    with transaction.atomic():
        new_bubble = create_normal(parent_bubble.document, content, parent_bubble, location)

        new_bubble.edit_lock_holder = user
        new_bubble.owner_with_lock = None
        if is_owned:
           new_bubble.owner_with_lock = user

        parent_bubble.insert_children(location, [new_bubble])

    return new_bubble

def do_create_suggest_bubble(
    user_id: int,
    document_id: int,
    binded_id: int,
    content: str
    ):
    '''Create a suggest bubble'''

    binded_bubble = do_fetch_normal_bubble(user_id, document_id, binded_id)

    check_contributor(user_id, binded_bubble)

    with transaction.atomic():
        new_suggest = create_suggest(binded_bubble, content)

        new_suggest.save()

    return new_suggest

def do_edit_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    content: str
    ):
    '''(Finish) edit content of the leaf bubble'''
 
    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)

    user = do_fetch_user(user_id)
    check_contributor(user_id, bubble)
    
    if not bubble.is_leaf():
        raise BubbleIsInternalError(bubble.id)

    if bubble.has_locked_ancestors() or bubble.is_locked():
        raise BubbleLockedError(bubble.id)
    
    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble.id)

    with transaction.atomic():
        bubble.change_content(content)

    return bubble

def do_unlock_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):
    ''' unlock bubble '''

    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)
    user = do_fetch_user(user_id)

    bubble.unlock(user)

def do_move_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    new_parent_id: int,
    new_location: int
    ):
    '''Move the normal bubble to another site'''
    
    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)
    new_parent = do_fetch_normal_bubble(user_id, document_id, new_parent_id)
    user = do_fetch_user(user_id)

    check_contributor(user_id, bubble)
    check_contributor(user_id, new_parent)

    if new_parent.is_leaf():
        raise BubbleIsLeafError(Bubble.id)

    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)

    if bubble.document.id != new_parent.document.id:
        raise NotInSameDocumentError(bubble.id, new_parent.id)

    if bubble.has_locked_ancestors():
        raise BubbleLockedError(bubble.id)
    
    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble.id)

    if new_parent.has_locked_ancestors() or new_parent.is_locked():
        raise BubbleLockedError(new_parent.id)

    with transaction.atomic():
        bubble.parent_bubble.splice_children(bubble.location, 1, new_parent, new_location)

    return new_parent

def cascaded_delete_children(user, bubble):
    for child in bubble.child_bubbles.all():
        if child.owned_by_other(user):
            raise BubbleOwnedError(bubble.id)
        cascaded_delete_children(user, child)
        bubble.delete_children(child.location, 1)

def do_delete_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):
    '''Delete the normal bubble'''

    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)
    user = do_fetch_user(user_id)

    check_contributor(user_id, bubble)

    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)

    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble.id)

    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble.id)

    with transaction.atomic():
        cascaded_delete_children(user, bubble)
        parent = bubble.parent_bubble
        parent.delete_children(bubble.location, 1)

    return None

def do_hide_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):

    bubble = do_fetch_suggest_bubble(user_id, document_id, bubble_id)

    check_suggest_contributor(user_id, bubble)

    with transaction.atomic():
        bubble.hide()

    return bubble

def do_show_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):

    bubble = do_fetch_suggest_bubble(user_id, document_id, bubble_id)

    check_suggest_contributor(user_id, bubble)

    with transaction.atomic():
        bubble.show()

    return bubble

def do_wrap_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id_list: list
    ):
    '''Wrap the normal bubbles'''

    if len(bubble_id_list) < 1:
        raise InvalidWrapError()

    bubbles = []

    for bubble_id in bubble_id_list:
        bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)
        bubbles.append(bubble)

    parent = bubbles[0].parent_bubble

    if parent.has_locked_ancestors() or parent.is_locked():
        raise BubbleIsLockedError(parent.id)

    check_contributor(user_id, bubbles[0])

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

    with transaction.atomic():
        wrapped = parent.wrap_children(bubble_locs[0], len(bubble_locs))

    return wrapped

def do_pop_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: list
    ):
    '''Pop the normal bubble'''

    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)
    user = do_fetch_user(user_id)

    check_contributor(user_id, bubble)

    if bubble.is_leaf():
        raise BubbleIsLeafError(bubble.id)

    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)

    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble.id)

    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble.id)

    with transaction.atomic():
        bubble.parent_bubble.pop_child(bubble.location)

    return bubble.parent_bubble

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
    document_id: int,
    bubble_id: list
    ):
    '''Flatten the normal bubble'''

    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)
    user = do_fetch_user(user_id)
    check_contributor(user_id, bubble)

    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble.id)

    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble.id)

    if bubble.is_leaf():
        return bubble

    flatten_content = ''

    with transaction.atomic():
        cascaded_flatten_children(user, bubble)
        bubble.change_content(flatten_content)

    return bubble

def do_split_leaf_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    split_content_list: list
    ):
    '''Split the leaf bubble'''

    if len(split_content_list) < 1:
        raise InvalidSplitError()

    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)

    check_contributor(user_id, bubble)

    if not bubble.is_leaf():
        raise BubbleIsInternalError(bubble.id)
    
    if bubble.has_locked_ancestors() or bubble.is_locked():
        raise BubbleLockedError(bubble.id)

    user = User.objects.get(id=user_id)
    if bubble.owned_by_other(user):
        raise BubbleOwnedError(bubble.id)

    # convert leaf bubble to internal bubble
    # whether bubble is leaf is determined by existence of child
    # so, add child to the bubble

    with transaction.atomic():
        bubble.change_content('')

        for idx, content in enumerate(split_content_list):
            create_normal(bubble.document, content, bubble, idx)
        
    return bubble

def do_split_internal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    split_location: list # list of int
    ):
    
    if len(split_location) < 1:
        raise InvalidSplitError()

    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)

    check_contributor(user_id, bubble)

    if bubble.is_leaf():
        raise BubbleIsLeafError(bubble.id)

    if bubble.has_locked_ancestors() or bubble.is_locked():
        raise BubbleLockedError(bubble.id)

    # check split location

    split_location[:0] = [0]
    split_location.append(bubble.child_count())

    for idx in range(0, len(split_location) - 1):
        split_first = split_location[idx]
        split_last = split_location[idx + 1]

        if split_last - split_first < 1:
            raise InvalidSplitError()

    with transaction.atomic():
        for idx in range(0, len(split_location) - 1):
            split_first = split_location[idx]
            split_last = split_location[idx + 1]

            bubble.wrap_children(split_first, split_last - split_first)

    return bubble

def do_vote_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    ):
    
    bubble = do_fetch_suggest_bubble(user_id, document_id, bubble_id)
    user = do_fetch_user(user_id)

    check_suggest_contributor(user_id, bubble)

    with transaction.atomic():
        bubble.vote(user)

    return bubble

def do_unvote_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):

    bubble = do_fetch_suggest_bubble(user_id, document_id, bubble_id)
    user = do_fetch_user(user_id)

    check_suggest_contributor(user_id, bubble)

    with transaction.atomic():
        bubble.unvote(user)

    return bubble

def do_switch_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int
    ):
    
    suggest = do_fetch_suggest_bubble(user_id, document_id, bubble_id)
    user = do_fetch_user(user_id)
    
    check_suggest_contributor(user_id, suggest)
    
    binded_bubble = suggest.normal_bubble
    
    if binded_bubble.has_locked_directs():
        raise BubbleLockedError(binded_bubble.id)

    if binded_bubble.owned_by_other(user):
        raise BubbleOwnedError(binded_bubble.id)

    do_flatten_normal_bubble(user_id, document_id, binded_bubble.id)

    with transaction.atomic():
        switch_content = suggest.content
        suggest.change_content(binded_bubble.content)
        binded_bubble.change_content(switch_content)
        suggest.save()
        binded_bubble.save()

    # TODO : switch voters info


    return binded_bubble

