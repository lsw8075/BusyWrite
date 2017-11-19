import json
import logging
from django.http import HttpResponse
from channels import Channel, Group
from channels.handler import AsgiHandler
from channels.sessions import channel_session, enforce_ordering
from .models import Document
import logging

log = logging.getLogger(__name__)

@channel_session
def ws_connect(message):
	# Extract document_id from the message. This expects message.path to be of the
	# form /document_detail/{document_id}/, and finds the document if the message
	# path is applicable, and if the document exists. Otherwise, bails.
	# (a.k.a _get_object_or_404)
	# (reference: antilibrary.or/1117, channels.readthedocs.io/en/stable/getting-started.html)
	try:
		prefix, id = message['path'].strip('/').split('/')
		if prefix != 'document_detail':
			log.debug('invalid ws path=%s', message['path'])
			return
		document = Document.objects.get(id=id)
	except ValueError:
		log.debug('invalid ws path=%s', message['path'])
		return
	except Document.DoesNotExist:
		log.debug('document does not exist for id=%s', id)
		return
#log.debug('document_detail connect document_id=%s client=%s:%s path=%s reply_channel=%s',
#			document.id, message['client'][0], message['client'][1], message['path'], message.reply_channel)

	message.reply_channel.send({"accept": True})
	Group('document_detail-'+id, channel_layer=message.channel_layer).add(message.reply_channel)
	message.channel_session['document_id'] = id

# Enforce ordering for security issue, at the expense of performance
#@enforce_ordering
@channel_session
def ws_receive(message):
	# Look up the document from the channel session, bailing if it doesn't exist
	try:
		id = message.channel_session['document_id']
		document = Document.objects.get(id=id)
		log.debug('received message, document exist id=%s', document.id)
	except KeyError:
		log.debug('no document in channel_session')
		return
	except Document.DoesNotExist:
		log.debug('received message, but document does not exist for id=%s', id)
		return

	# Parse out a message from the content text, bailing if it doesn't
	# conform to the expected message format.
	try:
		command = message.content['text']
	except ValueError:
		log.debug("ws message isn't json text=%s", command)
		return
	
#	if set(data.keys()) != set(('handle', 'message')):
#		log.debug("ws message unexpected format command=%s", command)
#		return
	
	if command:
#log.debug('message document_id=%s handle=%s message=%s',
#				document.id, data['handle'], data['message'])
		Group('document_detail-'+id, channel_layer=message.channel_layer).send({'text': command})

@channel_session
def ws_disconnect(message):
	try:
		id = message.channel_session['document_id']
		document = Document.objects.get(id=id)
		Group('document_detail-'+id, channel_layer=message.channel_layer).discard(message.reply_channel)
		message.reply_channel.send({"disconnected": True})
	except (KeyError, Document.DoesNotExist):
		pass
