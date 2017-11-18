class Error(Exception):
    '''Base class for our exceptions'''
    pass


class BubbleLockedError(Error):
    '''Raised when bubble is uneditable because of bubble lock'''
    def __init__(self, locked_bubble):
        self.locked_bubble = locked_bubble

    def __str__(self):
        return '[Error] Bubble %d is uneditable because of bubble lock' % self.locked_bubble.id

class BubbleOwnedError(Error):
    '''Raised when trying to edit bubble already owned by others'''
    def __init__(self, owned_bubble):
        self.owned_bubble = owned_bubble

    def __str__(self):
        return '[Error] Bubble %d is owned' % self.owned_bubble.id

class BubbleDoesNotExistError(Error):
    '''Raised when bubble with id does not exist'''
    def __init__(self, bubble_id):
        self.bubble_id = bubble_id

    def __str__(self):
        return '[Error] Bubble %d does not exist' % self.bubble_id

class UserDoesNotExistError(Error):
    '''Raised when User with id does not exist'''
    def __init__(self, user_id):
        self.user_id = user_id
    
    def __str__(self):
        return '[Error] User %d does not exist' % self.user_id

class UserIsNotContributorError(Error):
    '''Raised when User with id is not contributor of document'''
    def __init__(self, user, doc):
        self.user = user
        self.doc = doc

    def __str__(self):
        return '[Error] User %d is not contributor of document %d' % (self.user.id, self.doc.id)

class InvalidLocationError(Error):
    '''Raised when location is invaild'''
    def __init__(self, bubble, location):
        self.bubble = bubble
        self.location = location

    def __str__(self):
        return '[Error] Invaild Location %d in Internal %d' % (self.location, self.bubble.id)
        
class InvalidBubbleTypeError(Error):
    '''Raised when bubble type is mismatch'''
    def __init__(self, expected):
        self.expected = expected

    def __str__(self):
        return '[Error] Invaild Bubble type: %s expected' % expected

class NotInSameDocumentError(Error):
    '''Raised when two bubbles are not in the same document'''
    def __init__(self, bubble1, bubble2):
        self.bubble1 = bubble1
        self.bubble2 = bubble2

    def __str__(self):
        return '[Error] Two bubble %d and %d does not in the same document' % (bubble1.id, bubble2.id)


