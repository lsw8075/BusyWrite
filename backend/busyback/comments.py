from .models import *
from .users import do_fetch_user
from .documents import do_fetch_document
from .errors import *
from .bubbles import check_contributor, do_fetch_normal_bubble, do_fetch_suggest_bubble
from django.utils import timezone
from django.db import transaction


def do_fetch_comment_under_normal(
    user_id: int,
    document_id: int,
    comment_id: int
    ):
    
    user = do_fetch_user(user_id)
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id): 
        raise UserIsNotContributorError(user_id, document.id) 
    try:
        comment = CommentUnderNormal.objects.get(id=comment_id)
    except CommentUnderNormal.DoesNotExist:
        raise CommentDoesNotExistError(comment_id)

    if comment.bubble.document.id != document_id:
        raise DocumentMismatchError()

    return comment

def do_fetch_comment_under_suggest(
    user_id: int,
    document_id: int,
    comment_id: int
    ):
    
    user = do_fetch_user(user_id)
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id): 
        raise UserIsNotContributorError(user_id, document.id) 
    try:
        comment = CommentUnderSuggest.objects.get(id=comment_id)
    except CommentUnderSuggest.DoesNotExist:
        raise CommentDoesNotExistError(comment_id)

    if comment.bubble.normal_bubble.document.id != document_id:
        raise DocumentMismatchError()

    return comment

def do_fetch_comments_under_normal(
    user_id: int,
    document_id: int,
    bubble_id: int,
    ):

    user = do_fetch_user(user_id)
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id): 
        raise UserIsNotContributorError(user_id, document.id) 
    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)
    
    if bubble.document.id != document_id:
        raise DocumentMismatchError()

    comments = CommentUnderNormal.objects.filter(bubble=bubble).values()
    if len(comments) == 0:
        return []
    return list(comments)

def do_fetch_comments_under_suggest(
    user_id: int,
    document_id: int,
    bubble_id: int,
    ):

    user = do_fetch_user(user_id)
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id): 
        raise UserIsNotContributorError(user_id, document.id) 
    bubble = do_fetch_suggest_bubble(user_id, document_id, bubble_id)
    
    if bubble.normal_bubble.document.id != document_id:
        raise DocumentMismatchError()

    comments = CommentUnderSuggest.objects.filter(bubble=bubble).values()
    if len(comments) == 0:
        return []
    return list(comments)

def do_create_comment_under_normal(
    user_id: int,
    document_id: int,
    bubble_id: int,
    content
    ):

    user = do_fetch_user(user_id)
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id): 
        raise UserIsNotContributorError(user_id, document.id) 
    bubble = do_fetch_normal_bubble(user_id, document_id, bubble_id)

    if bubble.document.id != document_id:
        raise DocumentMismatchError()
    
    if content == '':
        raise ContentEmptyError()

    order = bubble.next_comment_order

    with transaction.atomic():
        comment = CommentUnderNormal.objects.create(content=content, owner=user, bubble=bubble, order=order)
        bubble.next_comment_order += 1
        bubble.save()

    return comment

def do_create_comment_under_suggest(
    user_id: int,
    document_id: int,
    bubble_id: int,
    content
    ):

    user = do_fetch_user(user_id)
    document = do_fetch_document(user_id, document_id)
    if not document.is_contributed_by(user_id): 
        raise UserIsNotContributorError(user_id, document.id) 
    bubble = do_fetch_suggest_bubble(user_id, document_id, bubble_id)

    if bubble.normal_bubble.document.id != document_id:
        raise DocumentMismatchError()
    
    if content == '':
        raise ContentEmptyError()

    order = bubble.next_comment_order

    with transaction.atomic():
        comment = CommentUnderSuggest.objects.create(content=content, owner=user, bubble=bubble, order=order)
        bubble.next_comment_order += 1
        bubble.save()

    return comment

def do_edit_comment_under_normal(
    user_id: int,
    document_id: int,
    comment_id: int,
    content
    ):

    comment = do_fetch_comment_under_normal(user_id, document_id, comment_id)

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    if content == '':
        raise ContentEmptyError()

    with transaction.atomic():
        comment.content = content
        comment.save()

    return comment

def do_edit_comment_under_suggest(
    user_id: int,
    document_id: int,
    comment_id: int,
    content
    ):

    comment = do_fetch_comment_under_suggest(user_id, document_id, comment_id)

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    if content == '':
        raise ContentEmptyError()

    with transaction.atomic():
        comment.content = content
        comment.save()

    return comment

def do_delete_comment_under_normal(
    user_id: int,
    document_id: int,
    comment_id: int
    ):

    comment = do_fetch_comment_under_normal(user_id, document_id, comment_id)

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    with transaction.atomic():
        comment.delete()

def do_delete_comment_under_suggest(
    user_id: int,
    document_id: int,
    comment_id: int
    ):

    comment = do_fetch_comment_under_suggest(user_id, document_id, comment_id)

    if comment.owner.id != user_id:
        raise UserIsNotCommentOwnerError(user_id, comment_id)

    with transaction.atomic():
        comment.delete()

