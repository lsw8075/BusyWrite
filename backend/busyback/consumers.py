import json
import logging
from django.http import HttpResponse
from channels import Channel, Group
from channels.handler import AsgiHandler
from channels.sessions import channel_session, enforce_ordering
from channels.auth import channel_session_user, channel_session_user_from_http
from .models import *
from .bubbles import *
import logging
import pdb

log = logging.getLogger(__name__)

@channel_session_user_from_http
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
        message.reply_channel.send({"header": "connect", "accept": False, "message": "invalid path"})
        return
    except Document.DoesNotExist:
        log.debug('document does not exist for id=%s', id)
        message.reply_channel.send({"header": "connect", "accept": False, "message": "document does not exist"})
        return
#log.debug('document_detail connect document_id=%s client=%s:%s path=%s reply_channel=%s',
#            document.id, message['client'][0], message['client'][1], message['path'], message.reply_channel)

    # Check if user is contributor of the document
    if not document.is_contributed_by(message.user.id):
        log.debug('document has no contributor with id=%d', message.user.id)
        message.reply_channel.send({"header": "connect", "accept": False, "message": "user does not contribute to the document"})
        return
    
    message.reply_channel.send({"accept": True})
    Group('document_detail-'+id, channel_layer=message.channel_layer).add(message.reply_channel)
    message.channel_session['document_id'] = id

# Enforce ordering for security issue, at the expense of performance
@channel_session_user
@enforce_ordering
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

    # Double check if user is contributor of the document
#    if not document.is_contributed_by(message.user):
#        message.reply_channel.send({"header": "response", "accept": False, "message": "user does not contribute to the document"})
#        return

    # Parse out a message from the content text, bailing if it doesn't
    # conform to the expected message format.
    try:
        command = message.content['header']
    except KeyError:
        log.debug("ws message doesn't have header")
        message.reply_channel.send({"header": "response", "accept": False, "message": "header needed"})
        return

    if not command:
        log.debug("ws message have invalid command=%s", command)
        message.reply_channel.send({"header": "response", "accept": False, "message": "invalid command"})
        return
       
    if command == 'get_bubble_list':
        result = do_fetch_bubbles(id)
        if not result:
            log.debug("there is not any bubble for document=%d", id)
            message.reply_channel.send({"header": "get_bubble_list", "accept": False, "message": "bubble does not exist for this document"})
            return
        message.reply_channel.send({"header": "get_bubble_list", "accept": True, "content": result})
        return

    elif command == 'create_bubble':
        try:
            data = json.loads(message.content['text'])
        except KeyError:
            log.debug("ws message isn't json text")
            message.reply_channel.send({'header': 'create_bubble', 'accept': False, 'message': 'no text attached'})
            return

        if set(data.keys()) != set(('parent', 'location', 'content')):
            log.debug("ws message unexpected format command=%s", command)
            return
        
        if data:
            # do_create_bubble creates bubble and give edit lock to user
            # TODO: pass over also document_id to do_create_bubble when merging with Seungwoo's code
            result = do_create_normal_bubble(message.user.id, int(data['parent']), 
                    int(data['location']), True, data['content'])

            if not result:
                log.debug("error occurred when creating new bubble at location=%d", data['location'])
                message.reply_channel__send({"header": "create_bubble", "accept": False, "text": data})
                return

            Group('document_detail-'+id, channel_layer=message.channel_layer).send({'header': 'create_bubble', 'accept': True, 'content': {'parent': data['parent'], 'location': data['location'], 'content': data['content']}})
            return

#elif command == '':
    else:
        log.debug("ws message have invalid command=%s", command)
        message.reply_channel.send({"accept": False, "message": "invalid command"})
        return

#    try:
#        data = message.content['text']
#    except ValueError:
#        log.debug("ws message isn't json text=%s", data)
#        return
    
#    if set(data.keys()) != set(('handle', 'message')):
#        log.debug("ws message unexpected format command=%s", command)
#        return
    
#    if command:
#log.debug('message document_id=%s handle=%s message=%s',
#                document.id, data['handle'], data['message'])
#        Group('document_detail-'+id, channel_layer=message.channel_layer).send({'text': data})

@channel_session_user
def ws_disconnect(message):
    try:
        id = message.channel_session['document_id']
        document = Document.objects.get(id=id)
        Group('document_detail-'+id, channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({"disconnected": True})
    except (KeyError, Document.DoesNotExist):
        pass
