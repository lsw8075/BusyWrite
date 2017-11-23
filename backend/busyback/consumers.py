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
    '''
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
        message.reply_channel.send({"accept": False, "message": "invalid path"})
        return
    except Document.DoesNotExist:
        log.debug('document does not exist for id=%s', id)
        message.reply_channel.send({"accept": False, "message": "document does not exist"})
        return
#log.debug('document_detail connect document_id=%s client=%s:%s path=%s reply_channel=%s',
#            document.id, message['client'][0], message['client'][1], message['path'], message.reply_channel)

    # Check if user is contributor of the document
    if not document.is_contributed_by(message.user.id):
        log.debug('document has no contributor with id=%d', message.user.id)
        message.reply_channel.send({"accept": False, "message": "user does not contribute to the document"})
        return
    Group('document_detail-'+id, channel_layer=message.channel_layer).add(message.reply_channel)
    message.channel_session['document_id'] = id

    '''
    message.reply_channel.send({"accept": True})


# Enforce ordering for security issue, at the expense of performance
@channel_session_user
@enforce_ordering
def ws_receive(message):
    
    try:
        command = message.content['header']
        text = message.content['text']
    except KeyError:
        log.debug("ws message doesn't have header or text")
        message.reply_channel.send({"header": "response", "accept": False, "text": "header and text needed"})
        return
    
    if not command:
        log.debug("ws message have invalid command")
        message.reply_channel.send({"header": "response", "accept": False, "text": "invalid command"})
        return

    if not text:
        log.debug("ws message have invalid text")
        message.reply_channel.send({"header": command, "accept": False, "text": "invalid text"})
        return

    if command == 'open_document':
        try:
            document_id = text['document_id']
            document = Document.objects.get(id=document_id)
        except KeyError:
            log.debug("open_document doesn't have document_id filed in text")
            message.reply_channel.send({"header": "open_document", "accept": False, "text": "document_id needed"})
            return
        except Document.DoesNotExist:
            log.debug('document does not exist for id=%s', id)
            message.reply_channel.send({"header": "open_document", "accept": False, "text": "document does not exist"})
            return
 
        # Check if user is contributor of the document
        if not document.is_contributed_by(message.user.id):
            log.debug('document has no contributor with id=%d', message.user.id)
            message.reply_channel.send({"accept": False, "message": "user does not contribute to the document"})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).add(message.reply_channel)
        message.channel_session['document_id'] = document_id
        message.reply_channel.send({"header": "open_document", "accept": True, "text": {"document_id": document_id}})
        return
   

    # Look up the document from the channel session, bailing if it doesn't exist
    try:
        document_id = message.channel_session['document_id']
        document = Document.objects.get(id=document_id)
        log.debug('received message, document exist id=%s', document.id)
    except KeyError:
        log.debug('no document in channel_session')
        message.reply_channel.send({"header": command, "accept": False, "text": "request command without opening valid document"})
        return
    except Document.DoesNotExist:
        log.debug('received message, but document does not exist for id=%s', document_id)
        message.reply_channel.send({"header": command, "accept": False, "text": "request command without opening valid document"})
        return

    # Double check if user is contributor of the document
    if not document.is_contributed_by(message.user.id):
        message.reply_channel.send({"header": command, "accept": False, "text": "user does not contribute to the document"})
        return
   
    if command == 'close_document':
        
        if not document_id == text['document_id']:
            message.reply_channel.send({"header": command, "accept": False, "text": "attempt to close unopened document"})
            return

        Group('document_id-'+document_id, channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({"header": command, "accept": True, "text": text['document_id']})
        return 
      
    if command == 'get_bubble_list':
        result = do_fetch_bubbles(document_id)
        if not result:
            log.debug("there is not any bubble for document=%d", id)
            message.reply_channel.send({"header": "get_bubble_list", "accept": False, "text": "bubble does not exist for this document"})
            return
        message.reply_channel.send({"header": "get_bubble_list", "accept": True, "text": {"content": result}})
        return

    elif command == 'create_bubble':
      
        if set(text.keys()) != set(('parent', 'location', 'content')):
            log.debug("ws message unexpected format command=%s", command)
            message.reply_channel.send({'header': 'create_bubble', 'accept': False, 'message': 'text does not follow format'})
            return
 
        # do_create_bubble creates bubble and give edit lock to user
        # TODO: pass over also document_id to do_create_bubble when merging with Seungwoo's code
        try:
            result = do_create_normal_bubble(message.user.id, int(text['parent']), 
                    int(text['location']), True, text['content'])
        except:
            log.debug("do_create_normal_bubble failed")
            message.reply_channel.send({'header': 'create_bubble', 'accept': False, 'message': 'create normal bubble failed'})
            return

        if not result:
            log.debug("error occurred when creating new bubble at location=%d", text['location'])
            message.reply_channel.send({"header": "create_bubble", "accept": False, "text": text})
            return

        Group('document_detail-'+id, channel_layer=message.channel_layer).send({'header': 'create_bubble', 'accept': True, 'content': {'parent': text['parent'], 'location': text['location'], 'content': text['content']}})
        return
    
    elif command == 'create_suggest_bubble':

        if set(text.keys()) != set(('binded_bubble', 'content')):
            log.debug("ws message unexpected format comand=%s", command)
            message.reply_channel.send({'header': 'create_suggest_bubble', 'accept': False, 'message': 'text does not follow format'})
            return

        try:
            # TODO: pass over also document_id
            result = do_create_suggest_bubble(message.user.id, int(text['binded_bubble']), text['content'])
        except:
            log.debug("do_create_suggest_bubble failed")
            message.reply_channel.send({'header': 'create_suggest_bubble', 'accept': False, 'message': 'create suggest bubble failed'})
            return

        if not result:
            log.debug("error occurred when creating new suggest bubble at bubble=%d", text['binded_bubble'])
            message.reply_channel.send({'header': 'create_suggest_bubble', 'accept': False, 'text': text})
            return

        Group('document_detail-'+id, channel_layer=message.channel_layer).send({'header': 'create_suggest_bubble', 'accept': True, 'content': {'binded_bubble': text['binded_bubble'], 'content': text['content']}})
        return
    
    elif command == 'edit_bubble':
        if set(text.keys()) != set(('bubble_id', 'content')):
            log.debug('ws message unexpeced format command=%s', command)
            message.reply_channel.send({'header': 'edit_bubble', 'accept': False, 'message': 'text does not follow format'})
            return

        try:
            result = do_edit_normal_bubble(message.user.id, int(text['bubble_id']), text['content'])
        except:
            log.debug("do_edit_normal_bubble failed")
            message.reply_channel.send({'header': 'edit_bubble', 'accept': False, 'message': 'edit bubble failed'})
            return

        Group('document_detail-'+id, channel_layer=message.channel_layer).send({'header': 'edit_bubble', 'accept': True, 'content': {'bubble_id': text['bubble_id'], 'content': text['content']}})
        return
        
    elif command == 'delete_bubble':
        if set(text.keys()) != set(('bubble_id')):
            log.debug("ws message unexpected format command=%s", command)
            message.reply_channel.send({'header': 'delete_bubble', 'accept': False, 'message': 'text does not follow format'})
            return

        try:
            result = do_delete_normal_bubble(message.user.id, int(text['bubble_id']))
        except:
            log.debug("do_delete_normal_bubble failed")
            message.reply_channel.send({"header": "delete_bubble", "accept": False, 'message': 'delete bubble failed'})
            return
        
        Group('document_detail-'+id, channel_layer=message.channel_layer).send({'header': 'delete_bubble', 'accept': True, 'content': {'bubble_id': text['bubble_id']}})
        return

    else:
        log.debug("ws message have invalid command=%s", command)
        message.reply_channel.send({"accept": False, "message": "invalid command"})
        return

#    try:
#        text = message.content['text']
#    except ValueError:
#        log.debug("ws message isn't json text=%s", text)
#        return
    
#    if set(text.keys()) != set(('handle', 'message')):
#        log.debug("ws message unexpected format command=%s", command)
#        return
    
#    if command:
#log.debug('message document_id=%s handle=%s message=%s',
#                document.id, text['handle'], text['message'])
#        Group('document_detail-'+id, channel_layer=message.channel_layer).send({'text': text})

@channel_session_user
def ws_disconnect(message):
    try:
        id = message.channel_session['document_id']
        document = Document.objects.get(id=id)
        Group('document_detail-'+id, channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({"disconnected": True})
    except (KeyError, Document.DoesNotExist):
        pass
