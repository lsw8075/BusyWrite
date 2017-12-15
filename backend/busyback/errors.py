class Error(Exception):
    '''Base class for our exceptions'''
    pass

# errors for bubbles

class BubbleLockedError(Error):
    '''Raised when bubble is uneditable because of bubble lock'''
    def __init__(self, locked_bubble):
        self.locked_bubble = locked_bubble

class BubbleOwnedError(Error):
    '''Raised when trying to edit bubble already owned by others'''
    def __init__(self, owned_bubble):
        self.owned_bubble = owned_bubble

class BubbleNotOwnedError(Error):
    '''Raised when trying to release ownership of bubble not owned by anyone'''
    def __init__(self, bubble):
        self.bubble = bubble

class BubbleDoesNotExistError(Error):
    '''Raised when bubble with id does not exist'''
    def __init__(self, bubble):
        self.bubble = bubble

class UserDoesNotExistError(Error):
    '''Raised when User with id does not exist'''
    def __init__(self, user):
        self.user = user

class UserIsNotContributorError(Error):
    '''Raised when User with id is not contributor of document'''
    def __init__(self, user, doc):
        self.user = user
        self.doc = doc

class InvalidLocationError(Error):
    '''Raised when location is invaild'''
    def __init__(self, bubble, location):
        self.bubble = bubble
        self.location = location
     
class NotInSameDocumentError(Error):
    '''Raised when two bubbles are not in the same document'''
    def __init__(self, bubble1, bubble2):
        self.bubble1 = bubble1
        self.bubble2 = bubble2

class BubbleIsRootError(Error):
    '''Raised when bubble is root'''
    def __init__(self, bubble):
        self.bubble = bubble

class BubbleIsLeafError(Error):
    def __init__(self, bubble):
        self.bubble = bubble


class BubbleIsInternalError(Error):
    def __init__(self, bubble):
        self.bubble = bubble

class InvalidWrapError(Error):
    def __init__(self):
        pass

class InvalidSplitError(Error):
    def __init__(self):
        pass

# errors for notes

class InternalError(Error):
    def __init__(self, msg):
        self.msg = msg

class CommentDoesNotExistError(Error):
    def __init__(self, comment):
        self.comment = comment

class DocumentDoesNotExistError(Error):
    def __init__(self, document):
        self.document = document

class NoteDoesNotExistError(Error):
    def __init__(self, note):
        self.note = note

class UserIsNotCommentOwnerError(Error):
    def __init__(self, user, comment):
        self.user = user
        self.comment = comment

class UserIsNotNoteOwnerError(Error):
    def __init__(self, user, note):
        self.user = user
        self.note = note

class ContentEmptyError(Error):
    pass

class DocumentMismatchError(Error):
    pass

class InvalidNoteOrderError(Error):
    pass

class InvalidUpdateError(Error):
    def __init__(self, bubble):
        self.bubble = bubble
