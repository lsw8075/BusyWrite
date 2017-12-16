from .models import *
from .errors import *
from .documents import fetch_document_with_lock
from .users import fetch_user
from .debug import print_bubble_tree
from .bubble_cache import *
from .versions import update_doc
from django.utils import timezone
from django.db import transaction
from django.forms.models import model_to_dict
from functools import wraps
from .operation_no import Operation
from .utils import create_normal, create_suggest
from .versions import *

def delete_normal(bubble):
    bubble.delete()
    # todo : delete bubble to trash bin?

def normal_operation(func):
    ''' Decorator for functions whose 4th arg is bubble_id'''
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('called ' + func.__name__ + '...')
        with transaction.atomic():
            rid_version = args[0]
            user_id = args[1]
            doc_id = args[2]
            bubble_id = args[3]
            document = fetch_document_with_lock(user_id, doc_id)

            try:
                bubble = NormalBubble.objects.get(id=bubble_id)
            except NormalBubble.DoesNotExist:
                raise BubbleDoesNotExistError(bubble_id)
            if bubble.deleted:
                raise BubbleDoesNotExistError(bubble_id)

            # might-be problem with reverse relationship..
            if bubble.document.id != doc_id:
                raise DocumentMismatchError()

            result = func(*args, document=document, bubble=bubble)
            document.save()

        return result
    return wrapper


def suggest_operation(func):
    ''' Decorator for functions whose 4th arg is suggest_id'''
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('called ' + func.__name__ + '...')
        with transaction.atomic():
            rid_version = args[0]
            user_id = args[1]
            doc_id = args[2]
            bubble_id = args[3]
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
    ''' Decorator for functions that not consider 4th arg '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('called ' + func.__name__ + '...')
        with transaction.atomic():
            rid_version = args[0]
            user_id = args[1]
            doc_id = args[2]
            document = fetch_document_with_lock(user_id, doc_id)
            result = func(*args, document=document)
            document.save()

        return result
    return wrapper

def fetch_normal(bubble_id):
    try:
        bubble = NormalBubble.objects.get(id=bubble_id)
    except NormalBubble.DoesNotExist:
        raise BubbleDoesNotExistError(bubble_id)
    if bubble.deleted:
        raise BubbleDoesNotExistError(bubble_id)

    return bubble

def fetch_suggest(bubble_id):
    try:
        bubble = SuggestBubble.objects.get(id=bubble_id)
    except SuggestBubble.DoesNotExist:
        raise BubbleDoesNotExistError(bubble_id)
    return bubble

def process_normal(bubble):
    ''' convert model to dict with proper child info '''
    result = model_to_dict(bubble)
    child_count = bubble.child_count()

    if child_count != 0:
        result['type'] = 'internal'
    else:
        result['type'] = 'leaf'

    child_list = []
    for i in range(0, child_count):
        child_list.append(0)
    for child in bubble.child_bubbles.all():
        child_list[child.location] = child.id

    result['child_bubbles'] = child_list

    del result['type']
    return result

def process_suggest(bubble):
    ''' covert model to dict '''
    return model_to_dict(bubble)

@normal_operation
def do_fetch_normal_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    return process_normal(kw['bubble'])

@suggest_operation
def do_fetch_suggest_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    return process_suggest(kw['bubble'])

@bubble_operation
def do_fetch_normal_bubbles(
    rversion: int,
    user_id: int,
    document_id: int,
    **kw
    ):
    document = kw['document']
    bubbles = document.bubbles.filter(deleted=False).all()
    if len(bubbles) == 0:
        raise InternalError('Document has no bubble')
    bubbles = list(bubbles)

    bubbles = [process_normal(b) for b in bubbles]
    return bubbles

@normal_operation
def do_fetch_suggest_bubbles(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    bubble = kw['bubble']
    suggests = bubble.suggest_bubbles.all()
    if len(suggests) == 0:
        return []
    suggests = list(suggests)
    suggests = [process_suggest(b) for b in suggests]
    return suggests

@bubble_operation
def do_get_root_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    **kw
    ):
    document = kw['document']
    return process_normal(get_root_bubble(document))

def get_root_bubble(document):
    try:
        root_bubble = NormalBubble.objects.filter(parent_bubble=None).get(document=document)
    except NormalBubble.MultipleObjectsReturned:
        raise InternalError('Document %d has multiple root bubble' % document.id)
    except NormalBubble.DoesNotExist:
        raise InternalError('Document %d has no root bubble' % document.id)
    return root_bubble

@normal_operation
@update_doc
def do_create_normal_bubble(
    rversion: int,
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

    if parent_bubble.is_leaf():
        raise BubbleIsLeafError(parent_bubble)

    check_updatable_with_siblings(rversion, parent_bubble, location)

    # create a bubble
    new_bubble = create_normal(parent_bubble.document, content, parent_bubble, location)

    new_bubble.edit_lock_holder = user
    if is_owned:
        new_bubble.owner_with_lock = user

    parent_bubble.insert_children(location, [new_bubble])

    load_bubble_to_cache(new_bubble, True)

    return (Operation.CREATE_NORMAL, process_normal(new_bubble))

@normal_operation
@update_doc
def do_updating_normal_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    content,
    **kw
    ):

    bubble = kw['bubble'];
    result = update_bubble_on_cache(user_id, bubble_id, content)
    if not result:
        raise InvalidUpdateError(bubble_id)
    return (Operation.EDIT_UPDATE, process_normal(bubble))

@normal_operation
@update_doc
def do_update_finish_normal_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    result = unload_bubble_from_cache(user_id, bubble_id)
    if result is None:
        raise InvalidUpdateError(bubble_id)
    (del_flag, content) = result

    bubble = kw['bubble']
    check_updatable(rversion, bubble)
    bubble.unlock(fetch_user(user_id))
    bubble.change_content(content)
    bubble.save()

    return (Operation.UPDATE_FINISH_NORMAL, process_normal(bubble))

@normal_operation
@update_doc
def do_update_discard_normal_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    result = unload_bubble_from_cache(user_id, bubble_id)
    if result is None:
        raise InvalidUpdateError(bubble_id)
    (del_flag, content) = result
    
    bubble = kw['bubble']
    check_updatable(rversion, bubble) 
    parent = bubble.parent_bubble
    if del_flag == 'True':
        check_updatable_with_siblings([(parent, bubble.location+1)])
        parent.delete_children(bubble.location, 1)
        delete_normal(bubble)
    else:
        bubble.unlock(fetch_user(user_id))

    return (Operation.UPDATE_DISCARD_NORMAL, process_normal(bubble))

@normal_operation
@update_doc
def do_edit_normal_bubble(
    rversion: int,
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

    check_updatable(rversion, bubble) 
    
    if content != '':
        bubble.change_content(content)
    bubble.lock(user)

    load_bubble_to_cache(bubble, False)

    return (Operation.EDIT_NORMAL, process_normal(bubble))


@normal_operation
@update_doc
def do_move_normal_bubble(
    rversion: int,
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
    check_updatable_with_siblings(rversion, parent, bubble.location)
    check_updatable_with_siblings(rversion, new_parent, new_location)
    parent.splice_children(bubble.location, 1, new_parent, new_location)

    return (Operation.MOVE_NORMAL, process_normal(new_parent))

def cascaded_delete_children(user, bubble):
    for child in bubble.child_bubbles.all():
        if child.is_locked():
            raise BubbleLockedError(bubble.id)
        cascaded_delete_children(user, child)
        bubble.delete_children(child.location, 1)
        delete_normal(child)

@normal_operation
@update_doc
def do_delete_normal_bubble(
    rversion: int,
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

    parent = bubble.parent_bubble
    check_updatable_with_descendants(rversion, bubble)
    check_updatable_with_siblings(rversion, parent, bubble.location)

    cascaded_delete_children(user, bubble)
    
    parent.delete_children(bubble.location, 1)
    delete_normal(bubble)

    return (Operation.DELETE_NORMAL, process_normal(parent))

@normal_operation
@update_doc
def do_create_suggest_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    binded_id: int,
    content: str,
    **kw
    ):
    '''Create a suggest bubble'''

    binded_bubble = kw['bubble']

    check_updatable(rversion, binded_bubble)

    new_suggest = create_suggest(binded_bubble, content)
    new_suggest.save()

    return (Operation.CREATE_SUGGEST, process_suggest(new_suggest))

@suggest_operation
@update_doc
def do_hide_suggest_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):

    bubble = kw['bubble']

    check_updatable(rversion, bubble)

    bubble.hide()

    return (Operation.HIDE_SUGGEST, process_suggest(bubble))

@suggest_operation
@update_doc
def do_show_suggest_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):

    bubble = kw['bubble']

    check_updatable(rversion, bubble)

    bubble.show()

    return (Operation.SHOW_SUGGEST, process_suggest(bubble))

@bubble_operation
@update_doc
def do_wrap_normal_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id_list: list,
    **kw
    ):
    return (Operation.WRAP_NORMAL, process_normal(wrap_bubble(rversion, user_id, document_id, bubble_id_list, **kw)))

def wrap_bubble(
    rversion: int,
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

    check_updatable_with_siblings(rversion, parent, bubble_locs[0])

    wrapped = parent.wrap_children(bubble_locs[0], len(bubble_locs))

    return wrapped

@normal_operation
@update_doc
def do_pop_normal_bubble(
    rversion: int,
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

    parent = bubble.parent_bubble
    check_updatable_with_siblings(rversion, parent, bubble.location)

    parent.pop_child(bubble.location)

    return (Operation.POP_NORMAL, process_normal(bubble.parent_bubble))


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
@update_doc
def do_flatten_normal_bubble(
    rversion: int,
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

    check_updatable_with_descendants(rversion, bubble)

    content = cascaded_flatten_children(user, bubble)
    bubble.change_content(content)

    return (Operation.FLATTEN_NORMAL, process_normal(bubble))

@normal_operation
@update_doc
def do_split_leaf_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    split_content_list: list,
    **kw
    ):
    '''Split the leaf bubble'''

    if len(split_content_list) < 1:
        raise InvalidSplitError()

    bubble = kw['bubble']

    if not bubble.is_leaf():
        raise BubbleIsInternalError(bubble.id)

    if bubble.has_locked_ancestors() or bubble.is_locked():
        raise BubbleLockedError(bubble.id)

    check_updatable(rversion, bubble)
    
    user = User.objects.get(id=user_id)
    # convert leaf bubble to internal bubble
    # whether bubble is leaf is determined by existence of child
    # so, add child to the bubble

    bubble.change_content('')

    created = []
    for idx, content in enumerate(split_content_list):
        created.append(create_normal(bubble.document, content, bubble, idx))
     
    return (Operation.SPLIT_LEAF, [process_normal(bubble) for bubble in created])

@normal_operation
@update_doc
def do_split_internal_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    split_location: list, # list of int
    **kw
    ):

    split_location = split_location[1:]
    
    if len(split_location) < 1:
        raise InvalidSplitError()

    bubble = kw['bubble']

    if bubble.is_leaf():
        raise BubbleIsLeafError(bubble.id)

    if bubble.has_locked_ancestors() or bubble.is_locked():
        raise BubbleLockedError(bubble.id)

    # check split location

    split_location.append(bubble.child_count())

    for idx in range(0, len(split_location) - 1):
        split_first = split_location[idx]
        split_last = split_location[idx + 1]

        if split_last - split_first < 1:
            raise InvalidSplitError()

    check_updatable_with_descendants(rversion, bubble)

    created = []
    for idx in range(0, len(split_location) - 1):
        split_first = split_location[idx]
        split_last = split_location[idx + 1]

        created.append(bubble.wrap_children(split_first, split_last - split_first))

    return (Operation.SPLIT_INTERNAL, [process_normal(bubble) for bubble in created])


@suggest_operation
@update_doc
def do_vote_suggest_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):

    user = fetch_user(user_id)
    bubble = kw['bubble']

    check_updatable(rversion, bubble.normal_bubble)

    bubble.vote(user)

    return (Operation.VOTE_SUGGEST, process_suggest(bubble))

def do_vote_bubble(rid, user_id, doc_id, bubble_id):
    return do_vote_suggest_bubble(rid, user_id, doc_id, bubble_id)

@suggest_operation
@update_doc
def do_unvote_suggest_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):

    user = fetch_user(user_id)
    bubble = kw['bubble']

    check_updatable(rversion, bubble.normal_bubble)

    bubble.unvote(user)

    return (Operation.UNVOTE_SUGGEST, process_suggest(bubble))

def do_unvote_bubble(rid, user_id, doc_id, bubble_id):
    return do_unvote_suggest_bubble(rid, user_id, doc_id, bubble_id)

@suggest_operation
@update_doc
def do_switch_bubble(
    rversion: int,
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
        check_updatable_with_descendants(rversion, binded_bubble)
        content = cascaded_flatten_children(user, binded_bubble)
        binded_bubble.change_content(content)
    else:
        check_updatable(rversion, binded_bubble)

    
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

    return (Operation.SWITCH_SUGGEST, process_normal(binded_bubble), process_suggest(suggest))

@normal_operation
@update_doc
def do_release_ownership(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    bubble = kw['bubble']
    if (bubble.owner_with_lock is None):
        raise BubbleNotOwnedError(bubble.id)
    if (bubble.owner_with_lock is not None):
        if (bubble.owner_with_lock.id != user_id):
            raise BubbleOwnedError(bubble.id)

    check_updatable(rversion, bubble)
    bubble.owner_with_lock = None
    bubble.save()
    return (Operation.RELEASE_OWNERSHIP_NORMAL, process_normal(bubble))

@bubble_operation
@update_doc
def do_merge_normal_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id_list: list,
    **kw
    ):

    

    bubble = wrap_bubble(rversion, user_id, document_id, bubble_id_list, **kw)

    check_updatable_with_descendants(rversion, bubble)
    content = cascaded_flatten_children(fetch_user(user_id), bubble)
    bubble.change_content(content)

    return (Operation.MERGE_NORMAL, process_normal(bubble))

@suggest_operation
@update_doc
def do_edit_suggest_bubble(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    content,
    **kw
    ):
    suggest = kw['bubble']
    check_updatable(rversion, suggest.normal_bubble)
    new_suggest = create_suggest(bind=suggest.normal_bubble, content=content)
    suggest.hide()

    return (Operation.EDIT_SUGGEST, process_suggest(new_suggest))
    
