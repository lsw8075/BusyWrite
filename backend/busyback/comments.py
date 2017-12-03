from .models import *
from .users import fetch_user
from .documents import fetch_document_with_lock
from .errors import *
from .bubbles import normal_operation, suggest_operation
from django.db import transaction
from functools import wraps

def commentN_operation(func):
    ''' Decorator for comment under normal functions '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        with transaction.atomic():
            user_id = args[0]
            doc_id = args[1]
            comment_id = args[2]
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
        with transaction.atomic():
            user_id = args[0]
            doc_id = args[1]
            comment_id = args[2]
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
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):
    return kw['comment']

  
@commentS_operation
def do_fetch_comment_under_suggest(
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):
    return kw['comment']


@normal_operation
def do_fetch_comments_under_normal(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    bubble = kw['bubble']
    
    comments = bubble.comments.values()
    if len(comments) == 0:
        return []
    return list(comments)

@suggest_operation
def do_fetch_comments_under_suggest(
    user_id: int,
    document_id: int,
    bubble_id: int,
    **kw
    ):
    bubble = kw['bubble']
    
    comments = bubble.comments.values()
    if len(comments) == 0:
        return []
    return list(comments)

@normal_operation
def do_create_comment_under_normal(
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

    comment = CommentUnderNormal.objects.create(content=content, owner=user, bubble=bubble, order=order)
    bubble.next_comment_order += 1
    bubble.save()

    return comment

@suggest_operation
def do_create_comment_under_suggest(
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

    return comment

@commentN_operation
def do_edit_comment_under_normal(
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

    return comment

@commentS_operation
def do_edit_comment_under_suggest(
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

    return comment

@commentN_operation
def do_delete_comment_under_normal(
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):

    comment = kw['comment']

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    comment.delete()

@commentS_operation
def do_delete_comment_under_suggest(
    user_id: int,
    document_id: int,
    comment_id: int,
    **kw
    ):

    comment = kw['comment']

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    comment.delete()
