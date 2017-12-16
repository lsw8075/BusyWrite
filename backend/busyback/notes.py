from .models import *
from .bubbles import normal_operation, suggest_operation

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
    pass

@normal_operation
def do_export_note_to_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    bubble_id: int,
    note_id: int,
    **kw
    ):
    pass

@normal_operation   
def do_export_note_to_comment_under_normal(
    rversion: int,
    user_id: int,
    document_id: int,
    normal_id: int,
    note_id: int,
    **kw
    ):
    pass

@suggest_operation
def do_export_note_to_comment_under_suggest(
    rversion: int,
    user_id: int,
    document_id: int,
    suggest_id: int,
    note_id: int,
    **kw
    ):
    pass
