from .models import *
from .errors import *
from .documents import fetch_document_with_lock
from .users import fetch_user
from .debug import print_bubble_tree
from django.utils import timezone
from django.db import transaction
from functools import wraps

def create_normal(doc, content='', parent=None, location=0):
    return NormalBubble.objects.create(content=content, document=doc, location=location, parent_bubble=parent)

def create_suggest(bind, content):
    return SuggestBubble.objects.create(content=content, normal_bubble=bind, hidden=False)

def normal_operation(func):
    ''' Decorator for functions whose 3rd arg is bubble_id'''
    @wraps(func)
    def wrapper(*args, **kwargs):
        with transaction.atomic():
            user_id = args[0]
            doc_id = args[1]
            bubble_id = args[2]
            document = fetch_document_with_lock(user_id, doc_id)
            try:
                bubble = NormalBubble.objects.get(id=bubble_id) 
            except NormalBubble.DoesNotExist:
                raise BubbleDoesNotExistError(bubble_id)

            # might-be problem with reverse relationship..
            if bubble.document.id != doc_id:
                raise DocumentMismatchError()

            result = func(*args, document=document, bubble=bubble)
            
            document.save()

        return result
    return wrapper
        
        
def suggest_operation(func):
    ''' Decorator for functions whose 3rd arg is suggest_id'''
    @wraps(func)
    def wrapper(*args, **kwargs):
        with transaction.atomic():
            user_id = args[0]
            doc_id = args[1]
            bubble_id = args[2]
            document = fetch_document_with_lock(user_id, doc_id)
            try:
                suggest = SuggestBubble.objects.get(id=bubble_id) 
            except SuggestBubble.DoesNotExist:
                raise BubbleDoesNotExistError(bubble_id)

            # might-be problem with reverse relationship..
            if suggest.normal_bubble.document.id != doc_id:
                raise DocumentMismatchError()

            result = func(*args, document=document, bubble=suggest)
            
            document.save()

        return result
    return wrapper

def bubble_operation(func):
    ''' Decorator for functions that not consider 3rd arg '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        with transaction.atomic():
            user_id = args[0]
            doc_id = args[1]
            document = fetch_document_with_lock(user_id, doc_id)
            result = func(*args, document=document)
            document.save()

        return result
    return wrapper

def fetch_normal(bubble_id):
    try:
        bubble = NormalBubble.objects.get(id=bubble_id)
    except NormalBubble.DoesNotExistError:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble

def fetch_suggest(bubble_id):
    try:
        bubble = SuggestBubble.objects.get(id=bubble_id)
    except SuggestBubble.DoesNotExistError:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble

@normal_operation
def do_fetch_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    return kw['bubble']

@suggest_operation
def do_fetch_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    return kw['bubble']

@bubble_operation
def do_fetch_normal_bubbles(
    user_id: int,
    document_id: int,
    **kw
    ):
    document = kw['document']
    bubbles = document.bubbles.values()
    if len(bubbles) == 0:
        raise InternalError('Document has no bubble')
    bubbles = list(bubbles)
    return bubbles

@normal_operation
def do_fetch_suggest_bubbles(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    bubble = kw['bubble']
    suggests = bubble.suggest_bubbles.values()
    if len(suggests) == 0:
        return []
    suggests = list(suggests)
    return suggests

@bubble_operation
def do_get_root_bubble(
    user_id: int,
    document_id: int,
    **kw
    ):
    try:
        document = kw['document']
        root_bubble = NormalBubble.objects.filter(parent_bubble=None).get(document=document)
    except NormalBubble.MultipleObjectsReturned:
        raise InternalError('Document %d has multiple root bubble' % document_id)
    except NormalBubble.DoesNotExist:
        raise InternalError('Document %d has no root bubble' % document_id)
    return root_bubble

def get_root_bubble(user_id, document_id):
    return do_get_root_bubble(user_id, document_id)

@normal_operation
def do_create_normal_bubble(
    user_id: int,
    document_id: int,
    parent_id: int,
    location: int,
    is_owned: bool,
    content: str,
    **kw
    ):
    '''Create a leaf bubble'''

    user = fetch_user(user_id)
    parent_bubble = kw['bubble']

    # check location is valid
    child_count = parent_bubble.child_count()
    if location < 0 or child_count < location:
        raise InvalidLocationError(parent_bubble.id, location)

    # check parent is leaf, locked

#    if parent_bubble.is_leaf():
#        raise BubbleIsLeafError(parent_bubble)

    # create a bubble
    new_bubble = create_normal(parent_bubble.document, content, parent_bubble, location)

    new_bubble.edit_lock_holder = user
    new_bubble.owner_with_lock = None
    if is_owned:
       new_bubble.owner_with_lock = user

    parent_bubble.insert_children(location, [new_bubble])

    return new_bubble

@normal_operation
def do_create_suggest_bubble(
    user_id: int,
    document_id: int,
    binded_id: int,
    content: str,
    **kw
    ):
    '''Create a suggest bubble'''

    binded_bubble = kw['bubble']

    new_suggest = create_suggest(binded_bubble, content)
    new_suggest.save()
    return new_suggest

@normal_operation
def do_edit_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    content,
    **kw
    ):
    '''start edit content of the leaf bubble'''
 
    user = fetch_user(user_id)
    bubble = kw['bubble']
    
    if not bubble.is_leaf():
        raise BubbleIsInternalError(bubble.id)

    if bubble.has_locked_ancestors() or bubble.is_locked():
        raise BubbleLockedError(bubble.id)
    
    if content != '':
        bubble.change_content(content)
    bubble.lock(user)

    return bubble

@normal_operation
def do_unlock_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    ''' unlock bubble '''
    user = fetch_user(user_id)
    bubble = kw['bubble']

    bubble.unlock(user)

@normal_operation
def do_move_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    new_parent_id: int,
    new_location: int,
    **kw
    ):
    '''Move the normal bubble to another site'''
    
    user = fetch_user(user_id)
    bubble = kw['bubble']
    new_parent = fetch_normal(new_parent_id)

    if new_parent.is_leaf():
        raise BubbleIsLeafError(Bubble.id)

    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)

    if bubble.document.id != new_parent.document.id:
        raise NotInSameDocumentError(bubble.id, new_parent.id)

    if bubble.has_locked_ancestors():
        raise BubbleLockedError(bubble.id)
    
    if new_parent.has_locked_ancestors() or new_parent.is_locked():
        raise BubbleLockedError(new_parent.id)

    parent = bubble.parent_bubble
    parent.splice_children(bubble.location, 1, new_parent, new_location)
    
    return new_parent

def cascaded_delete_children(user, bubble):
    for child in bubble.child_bubbles.all():
        if child.is_locked():
            raise BubbleLockedError(bubble.id)
        cascaded_delete_children(user, child)
        bubble.delete_children(child.location, 1)
        NormalBubble.delete(child)

@normal_operation
def do_delete_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    '''Delete the normal bubble'''

    user = fetch_user(user_id)
    bubble = kw['bubble']

    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)

    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble.id)


    cascaded_delete_children(user, bubble)
    parent = bubble.parent_bubble
    parent.delete_children(bubble.location, 1)

    return None

@suggest_operation
def do_hide_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):

    bubble = kw['bubble']
    bubble.hide()

    return bubble

@suggest_operation
def do_show_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):

    bubble = kw['bubble']
    bubble.show()

    return bubble

@bubble_operation
def do_wrap_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id_list: list,
    **kw
    ):
    '''Wrap the normal bubbles'''

    if len(bubble_id_list) < 1:
        raise InvalidWrapError()

    bubbles = []

    for bubble_id in bubble_id_list:
        bubble = fetch_normal(bubble_id)
        bubbles.append(bubble)

    parent = bubbles[0].parent_bubble
    document = kw['document']

    # it might be a problem
    if parent.document.id != document.id:
        raise DocumentMismatchError()

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

    wrapped = parent.wrap_children(bubble_locs[0], len(bubble_locs))

    return wrapped

@normal_operation
def do_pop_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    '''Pop the normal bubble'''

    user = fetch_user(user_id)
    bubble = kw['bubble']

    if bubble.is_leaf():
        raise BubbleIsLeafError(bubble.id)

    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)

    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble.id)

    bubble.parent_bubble.pop_child(bubble.location)

    return bubble.parent_bubble


def cascaded_flatten_children(user, bubble):
    s = bubble.content
    for child in bubble.child_bubbles.all():
        if child.is_locked():
            raise BubbleLockedError(bubble.id)
        s = s + cascaded_flatten_children(user, child)
        bubble.delete_children(child.location, 1)
        NormalBubble.delete(child)
    return s

@normal_operation
def do_flatten_normal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    '''Flatten the normal bubble'''

    user = fetch_user(user_id)
    bubble = kw['bubble']

    if bubble.has_locked_directs():
        raise BubbleLockedError(bubble.id)

    if bubble.is_leaf():
        return bubble

    content = cascaded_flatten_children(user, bubble)
    bubble.change_content(content)

    return bubble

@normal_operation
def do_split_leaf_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    split_content_list: list,
    **kw
    ):
    '''Split the leaf bubble'''

    split_content_list = split_content_list[1:]

    if len(split_content_list) < 1:
        raise InvalidSplitError()

    bubble = kw['bubble']

    if not bubble.is_leaf():
        raise BubbleIsInternalError(bubble.id)
    
    if bubble.has_locked_ancestors() or bubble.is_locked():
        raise BubbleLockedError(bubble.id)

    user = User.objects.get(id=user_id)
    # convert leaf bubble to internal bubble
    # whether bubble is leaf is determined by existence of child
    # so, add child to the bubble

    bubble.change_content('')

    for idx, content in enumerate(split_content_list):
        create_normal(bubble.document, content, bubble, idx)
        
    return bubble

@normal_operation
def do_split_internal_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    split_location: list, # list of int
    **kw
    ):
    
    if len(split_location) < 1:
        raise InvalidSplitError()

    bubble = kw['bubble']

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

    for idx in range(0, len(split_location) - 1):
        split_first = split_location[idx]
        split_last = split_location[idx + 1]

        bubble.wrap_children(split_first, split_last - split_first)

    return bubble

@suggest_operation
def do_vote_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    
    user = fetch_user(user_id)
    bubble = kw['bubble']
    bubble.vote(user)

    return bubble

def do_vote_bubble(user_id, doc_id, bubble_id):
    return do_vote_suggest_bubble(user_id, doc_id, bubble_id)

@suggest_operation
def do_unvote_suggest_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    
    user = fetch_user(user_id)
    bubble = kw['bubble']
    bubble.unvote(user)

    return bubble

def do_unvote_bubble(user_id, doc_id, bubble_id):
    return do_unvote_suggest_bubble(user_id, doc_id, bubble_id)

@suggest_operation
def do_switch_bubble(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):

    user = fetch_user(user_id)
    suggest = kw['bubble']
    
    binded_bubble = suggest.normal_bubble
    
    if binded_bubble.has_locked_directs():
        raise BubbleLockedError(binded_bubble.id)


    if not binded_bubble.is_leaf():
        content = cascaded_flatten_children(user, binded_bubble)
        binded_bubble.change_content(content)

    with transaction.atomic():
        # switch content
        switch_content = suggest.content
        suggest.change_content(binded_bubble.content)
        binded_bubble.change_content(switch_content)

        # switch voters
        suggest_voters = []
        binded_voters = []
        for voter in suggest.voters.all():
            suggest_voters.append(voter)
            suggest.voters.remove(voter)
        for voter in binded_bubble.voters.all():
            binded_voters.append(voter)
            binded_bubble.voters.remove(voter)
        for voter in suggest_voters:
            binded_bubble.voters.add(voter)
        for voter in binded_voters:
            suggest.voters.add(voter)

        # switch comments
        suggest_comments = []
        binded_comments = []
        for comment in suggest.comments.all():
            com_data = (comment.content, comment.owner, comment.order)
            suggest_comments.append(com_data)
            comment.delete()
        for comment in binded_bubble.comments.all():
            com_data = (comment.content, comment.owner, comment.order)
            binded_comments.append(com_data)
            comment.delete()

        next_comment_order_suggest = suggest.next_comment_order
        next_comment_order_normal = binded_bubble.next_comment_order
        suggest.next_comment_order = next_comment_order_normal
        binded_bubble.next_comment_order = next_comment_order_suggest
        for com_data in suggest_comments:
            (content, owner, order) = com_data
            CommentUnderNormal.objects.create(content=content, owner=owner, order=order, bubble=binded_bubble)
        for com_data in binded_comments:
            (content, owner, order) = com_data
            CommentUnderSuggest.objects.create(content=content, owner=owner, order=order, bubble=suggest)        

        suggest.save()
        binded_bubble.save()
    return binded_bubble


