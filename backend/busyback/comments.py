from .models import *
from .users import fetch_user
from .documents import fetch_document_with_lock
from .errors import *
from .bubbles import normal_operation, suggest_operation
from .versions import update_doc
from django.db import transaction
from functools import wraps
from django.forms.models import model_to_dict
from .operation_no import Operation
from .utils import process_comment

def commentN_operation(func):
    ''' Decorator for comment under normal functions '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('called ' + func.__name__ + '...')
        with transaction.atomic():
            rversion = args[0]
            user_id = args[1]
            doc_id = args[2]
            comment_id = args[3]
            document = fetch_document_with_lock(user_id, doc_id)
            try:
                comment = CommentUnderNormal.objects.get(id=comment_id)
            except CommentUnderNormal.DoesNotExist:
                raise CommentDoesNotExistError(comment_id)

            if comment.bubble.document.id != doc_id:
                raise DocumentMismatchError()

            result = func(*args, document=document, comment=comment)
            document.save()

        return result
    return wrapper


def commentS_operation(func):
    ''' Decorator for comment under suggest functions '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('called ' + func.__name__ + '...')
        with transaction.atomic():
            rversion = args[0]
            user_id = args[1]
            doc_id = args[2]
            comment_id = args[3]
            document = fetch_document_with_lock(user_id, doc_id)
            try:
                comment = CommentUnderSuggest.objects.get(id=comment_id)
            except CommentUnderSuggest.DoesNotExist:
                raise CommentDoesNotExistError(comment_id)

            if comment.bubble.normal_bubble.document.id != doc_id:
                raise DocumentMismatchError()

            result = func(*args, document=document, comment=comment)
            document.save()

        return result
    return wrapper

@commentN_operation
def do_fetch_comment_under_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):
    return process_comment(kw['comment'])

  
@commentS_operation
def do_fetch_comment_under_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):
    return process_comment(kw['comment'])


@normal_operation
def do_fetch_comments_under_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    bubble = kw['bubble']
    
    comments = bubble.comments.all()
    if len(comments) == 0:
        return []
    return [process_comment(c) for c in comments]

@suggest_operation
def do_fetch_comments_under_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    bubble = kw['bubble']
    
    comments = bubble.comments.all()
    if len(comments) == 0:
        return []
    return [process_comment(c) for c in comments]

@normal_operation
@update_doc
def do_create_comment_under_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    content,
    **kw
    ):

    user = fetch_user(user_id)
    bubble = kw['bubble']

    if bubble.is_root():
        raise BubbleIsRootError(bubble.id)

    if content == '':
        raise ContentEmptyError()

    order = bubble.next_comment_order

    comment = CommentUnderNormal.objects.create(content=content, owner=user, bubble=bubble, order=order)
    bubble.next_comment_order += 1
    bubble.save()

    return (Operation.CREATE_NCOMMENT, process_comment(comment))

@suggest_operation
@update_doc
def do_create_comment_under_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    content,
    **kw
    ):

    user = fetch_user(user_id)
    bubble = kw['bubble']
    
    if content == '':
        raise ContentEmptyError()

    order = bubble.next_comment_order

    comment = CommentUnderSuggest.objects.create(content=content, owner=user, bubble=bubble, order=order)
    bubble.next_comment_order += 1
    bubble.save()

    return (Operation.CREATE_SCOMMENT, process_comment(comment))

@commentN_operation
@update_doc
def do_edit_comment_under_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    comment_id: int,
    content,
    **kw
    ):

    comment = kw['comment']

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    if content == '':
        raise ContentEmptyError()

    comment.content = content
    comment.save()

    return (Operation.EDIT_NCOMMENT, process_comment(comment))

@commentS_operation
@update_doc
def do_edit_comment_under_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    comment_id: int,
    content,
    **kw
    ):

    comment = kw['comment']

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    if content == '':
        raise ContentEmptyError()

    comment.content = content
    comment.save()

    return (Operation.EDIT_SCOMMENT, process_comment(comment))

@commentN_operation
@update_doc
def do_delete_comment_under_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):

    comment = kw['comment']

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    comment.delete()

    return (Operation.DELETE_NCOMMENT, None)

@commentS_operation
@update_doc
def do_delete_comment_under_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):

    comment = kw['comment']

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    comment.delete()

    return (Operation.DELETE_SCOMMENT, None)
