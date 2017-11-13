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

