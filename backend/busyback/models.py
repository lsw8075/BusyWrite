from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from .errors import *

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

    def is_owner(self, user):
        return self.owner.id == user

class Document(models.Model):
    title = models.TextField()
    contributors = models.ManyToManyField(
    	User,
    	related_name='documents'
    )

    def is_contributed_by(self, user_id):
        return self.contributors.filter(id__exact=user_id).exists()

    def add_contributor(self, user):
        self.contributor.add(user)
        self.save()

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
    voters = models.ManyToManyField(
    	User,
    	related_name='voted_bubbles'
    )

    def touch(self):
        self.save()

    def change_content(self, content):
        '''Change bubble's content'''
        self.content = content
        self.touch()

    def is_voted_by(self, user):
        return self.voters.filter(id=user.id).exists()

    def vote(self, user):
        if not self.is_voted_by(user):
            self.voters.add(user)
        self.save()

    def unvote(self, user):
        if self.is_voted_by(user):
            self.voters.remove(user)
        self.save()

class NormalBubble(Bubble):
    location = models.IntegerField(null=True)
        
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
    parent_bubble = models.ForeignKey(
    	'NormalBubble',
    	related_name='child_bubbles',
    	null=True
    )

    document = models.ForeignKey(
    	'Document',
    	related_name='bubbles',
    )

    def touch(self):
        super().touch()
        if not self.is_root():
            self.parent_bubble.touch()

    def child_count(self):
        return self.child_bubbles.count()

    def is_leaf(self):
        '''check if self is leaf bubble'''
        return self.child_count() == 0

    def is_root(self):
        '''check if self is root'''
        return self.parent_bubble is None

    def owned_by_other(self, user):
        return (self.owner_with_lock is not None and
                self.owner_with_lock.id != user.id)
    # lock methods

    def has_locked_ancestors(self):
        '''Check any ancestor bubble is locked'''
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

    def has_locked_directs(self):
        return (self.has_locked_ancestors() or
                self.has_locked_descendants() or
                self.is_locked())

    def is_locked(self):
        return self.edit_lock_holder is not None

    def lock(self, user):
        editlock = self.edit_lock_holder
        if self.has_locked_directs():
            raise BubbleLockedError(self)
        else:
            self.edit_lock_holder = user
            self.save()

    def unlock(self, user):
        editlock = self.edit_lock_holder
        if editlock is not None:
            if editlock.id == user.id:
                self.edit_lock_holder = None
                self.save()
            else:
                raise BubbleLockedError(self)

    # args of all bubble method below should be checked before use
    # locs of new bubbles are auto-determined by these methods,
    # so in the view you just create with dummy location.

    def fetch_child(self, location):
        try:
            child = self.child_bubbles.get(location=location)
        except NormalBubble.DoesNotExist:
            raise InvalidLocationError(self, location)
        return child

    def adjust_children_location(self, start, adjust):
        children = self.child_bubbles.all()
        for child in children:
            if child.location >= start:
                child.location += adjust
            child.save()
    
    def splice_children(self, location, splice_count=0, new_parent=None, new_location=0, splice_list=[]):
        ''' Method splice_children : Bubble version of JS splice
            first, detach splice_count children from location of internal bubble self
            next, if new_parent is not None, insert detached children into new_parent's new_location 
            else, just delete the children
            finally, insert bubbles in splice_list to the location
        '''
        # assert when self == new_parent, splice_list is empty
        if new_parent is not None and self.id == new_parent.id and splice_list != []:
            raise InternalError('invaild use of splice_children')

        # mark target childrens to be unaffected by adjusting
        splice_end = location + splice_count
        for child in self.child_bubbles.all():
            if (location <= child.location and
                child.location < splice_end):
                child.location = -child.location - 1
                child.save()

        # adjust location (order is matter)
        self.adjust_children_location(splice_end, len(splice_list) - splice_count)

        if new_parent is not None:
            new_parent.adjust_children_location(new_location, splice_count)
        
        # process target childrens
        for child in self.child_bubbles.all():
            if child.location < 0:
                if new_parent is not None:
                    child.location = -1 - child.location - location + new_location
                    child.parent_bubble = new_parent
                    child.save()
                else:
                    child.delete()

        # add new bubbles if they exist
        for idx, child in enumerate(splice_list):
            child.location = location + idx
            child.parent_bubble = self
            child.save()

        return self

    def insert_children(self, location, insert_list):
        self.splice_children(location, splice_list=insert_list)
        return insert_list[0]

    def delete_children(self, location, delete_count):
        self.splice_children(location, delete_count)
        return self

    def wrap_children(self, location, wrap_count):
        wrapper = NormalBubble.objects.create(document=self.document, content='', location=0)
        self.splice_children(location, wrap_count, wrapper, 0, [wrapper])
        return wrapper

    def pop_child(self, location):
        popped = self.fetch_child(location)
        self.splice_children(location, 1, splice_list=popped.child_bubbles.all())
        popped.delete()
        return self

        
class SuggestBubble(Bubble):
    hidden = models.BooleanField()	
    normal_bubble = models.ForeignKey(
    	'NormalBubble',
    	related_name='suggest_bubbles',
    	null=False
    )

    def show(self):
        self.hidden = False
        self.save()

    def hide(self):
        self.hidden = True
        self.save()

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
