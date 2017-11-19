from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Directory(models.Model):
    name = models.TextField()
    owner = models.ForeignKey(
    	User,
    	related_name='directories',
    	null=False
    )
    parent_directory = models.ForeignKey(
    	'Directory',
    	related_name='child_directories',
    	null=True # root directory has no parent
    )
    # need to check if this info matches Document.contributors info
    # when user is added as contributor, or document is deleted from directory
    child_documents = models.ManyToManyField(
    	'Document',
    	related_name='parent_directory'
    )

class Document(models.Model):
    title = models.TextField()
    contributors = models.ManyToManyField(
    	User,
    	related_name='documents'
    )
    def is_contributed_by(self, user_id: int):
        return self.filter(id__exact=user_id).exist()

class Note(models.Model):
    content = models.TextField()
    order = models.IntegerField()
    # need to check if owner is document's contributor
    # every time note is added
    owner = models.ForeignKey(
    	User,
    	related_name='notes',
    	null=False
    )
    document = models.ForeignKey(
    	'Document',
    	related_name='notes',
    	null=False
    )

class Bubble(models.Model):
    content = models.TextField()
    timestamp = models.DateTimeField()
    voters = models.ManyToManyField(
    	User,
    	related_name='voted_bubbles'
    )

    def touch(self):
        '''Update timestamp.'''
        from datetime import datetime
        timestamp = datetime.now()

    def update(func):
        '''Decorator for bubble-updating methods.'''
        def wrapper(self, *args, **kwargs):
            '''decorate'''
            # if update the timestamp
            self.touch()
            self.func(*args, **kwargs)
 
    def has_locked_directs(self):
        # overrided by NormalBubble
        return None

    @update
    def change_content(self, content: str):
        '''Change bubble's content'''
        locked = self.get_locked_direct()
        if locked is not None:
            raise BubbleLockedError
        self.content = content

class NormalBubble(Bubble):
    location = models.IntegerField()
    # need to check if editLockHolder and ownerWithLock are
    # contributors of the document
    edit_lock_holder = models.ForeignKey(
    	User,
    	related_name='editing_bubbles',
    	null=True
    )
    owner_with_lock = models.ForeignKey(
    	User,
    	related_name='owning_bubbles',
    	null=True
    )
    document = models.ForeignKey(
    	'Document',
    	related_name='bubbles',
    	null=False
    )
    parent_bubble = models.ForeignKey(
    	'Bubble',
    	related_name='child_bubbles',
    	null=True
    )

    def has_locked_ancestors(self):
        '''Check self/any ancestor bubble is locked'''
        # check self is root
        if self.is_root():
            return False
        # check for ancestors
        if self.parent_bubble.edit_lock_holder is not None:
            return True
        return self.parent_bubble.has_locked_ancestors()

    def has_locked_descendants(self):
        '''Check any descendant bubble is locked'''
        # check for descendants
        for child in self.child_bubbles.all():
            if (child.edit_lock_holder is not None or
                child.has_locked_descendants()):
                return True
        # if all descendants are not locked
        return False

    def is_locked(self):
        return self.edit_lock_holder is not None

    def has_locked_directs(self):
        return (self.has_locked_ancestors() or
                self.has_locked_descendants() or
                self.is_locked())

    def child_count(self):
        return len(self.child_bubbles)

    def is_leaf(self):
        '''check if self is leaf bubble'''
        return self.child_count() == 0

    def is_root(self):
        '''check if self is root'''
        return self.parent_bubble is None

    def owned_by_other(self, user):
        return (self.owner_with_lock is not None and
                self.owner_with_lock != user)

class SuggestBubble(Bubble):
    hidden = models.BooleanField()	
    normal_bubble = models.ForeignKey(
    	'NormalBubble',
    	related_name='suggest_bubbles',
    	null=False
    )

class Comment(models.Model):
    content = models.TextField()
    owner = models.ForeignKey(
    	User,
    	related_name='comments',
    	null=False
    )
    timestamp = models.DateTimeField()
    bubble = models.ForeignKey(
    	'Bubble',
    	related_name='comments',
    	null=False
    )

class News(models.Model):
    receiver = models.ForeignKey(
    	User,
    	related_name='news',
    	null=False
    )
    document = models.ForeignKey(
    	'Document',
    	related_name='news',
    	null=False
    )

class Invitation(News):
    sender = models.ForeignKey(
    	User,
    	related_name='invitations',
    	null=False
    )

# TODO: find out way to generate shareable link and save it
class SharedLink(News):
    sender = models.ForeignKey(
    	User,
    	related_name='shared_links',
    	null=False
    )

class Notification(News):
    notitype = models.IntegerField()
    who = models.TextField()
