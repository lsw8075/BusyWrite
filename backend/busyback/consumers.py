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

# reference: antilibrary.or/1117, channels.readthedocs.io/en/stable/getting-started.html

log = logging.getLogger(__name__)


@channel_session_user_from_http
def ws_connect(message):
    # TODO: check message.user.is_authenticated
    log.debug("ws_connect")
    message.reply_channel.send({"accept": True})


# Enforce ordering for security issue, at the expense of performance
@channel_session_user
@enforce_ordering
def ws_receive(message):
    
    log.debug("ws_receive")
    try:
        text = json.loads(message.content['text'].replace("'", "\""))
        command = text['header']
        body = text['body']
    except KeyError:
        log.debug("ws message doesn't have header")
        message.reply_channel.send({"text": 
                {"header": "response", "accept": 'False', "body": "header and body needed"}})
        return
    except ValueError:
        log.debug("ws message doesn't have proper body")
        message.reply_channel.send({"text":
                {"header": "response", "accept": 'False', "body": "header and body needed"}})
        return
    
    if not command:
        log.debug("ws message have invalid command")
        message.reply_channel.send({"text":
                {"header": "response", "accept": 'False', "body": "empty command"}})
        return

    if not body:
        log.debug("ws message have invalid body")
        message.reply_channel.send({"text":
                {"header": command, "accept": 'False', "body": "empty body"}})
        return

    if command == 'open_document':
        try:
            document_id = body['document_id']
            document = Document.objects.get(id=int(document_id))
        except KeyError:
            log.debug("open_document doesn't have document_id filed in body")
            message.reply_channel.send({"text":
                    {"header": "open_document", "accept": 'False', "body": "document_id needed"}})
            return
        except Document.DoesNotExist:
            log.debug('document does not exist for id=%s', document_id)
            message.reply_channel.send({"text":
                    {"header": "open_document", "accept": 'False', "body": "document does not exist"}})
            return
 
        # Check if user is contributor of the document
        if not document.is_contributed_by(message.user.id):
            log.debug('document has no contributor with id=%d', message.user.id)
            message.reply_channel.send({"text":
                    {"header": "open_document", "accept": 'False', "body": "user does not contribute to the document"}})
            return

        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).add(message.reply_channel)
        message.channel_session['document_id'] = str(document_id)
        message.reply_channel.send({"text":
                {"header": "open_document", "accept": 'True', "body": {"document_id": document_id}}})
        return
   

    # Look up the document from the channel session, bailing if it doesn't exist
    try:
        document_id = str(message.channel_session['document_id'])
        document = Document.objects.get(id=int(document_id))
        log.debug('received message, document exist id=%s', document.id)
    except KeyError:
        log.debug('no document in channel_session')
        message.reply_channel.send({"text":
                {"header": command, "accept": 'False', "body": "request command without opening valid document"}})
        return
    except Document.DoesNotExist:
        log.debug('received message, but document does not exist for id=%s', document_id)
        message.reply_channel.send({"text":
                {"header": command, "accept": 'False', "body": "request command without opening valid document"}})
        return

    # Double check if user is contributor of the document
    if not document.is_contributed_by(message.user.id):
        message.reply_channel.send({"text":
                {"header": command, "accept": 'False', "body": "user does not contribute to the document"}})
        return
   
    if command == 'close_document':
       
        if not int(document_id) == int(body['document_id']):
            message.reply_channel.send({"text":
                    {"header": command, "accept": 'False', "body": "attempt to close unopened document"}})
            return

        Group('document_id-'+str(document_id), channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({"text":
                {"header": command, "accept": 'True', "body": {"document_id": body['document_id']}}})
        return 
      
    if command == 'get_bubble_list':
        result = do_fetch_bubbles(document_id)
        if not result:
            log.debug("there is not any bubble for document=%s", document_id)
            message.reply_channel.send({"text":
                    {"header": "get_bubble_list", "accept": 'False', "body": "bubble does not exist for this document"}})
            return
        message.reply_channel.send({"text":
                {"header": "get_bubble_list", "accept": 'True', "body": {"content": result}}})
        return

    elif command == 'create_bubble':
      
        if set(body.keys()) != set(('parent', 'location', 'content')):
            log.debug("ws message unexpected format command=%s", command)
            message.reply_channel.send({"text":
                    {'header': 'create_bubble', 'accept': 'False', 'body': 'body does not follow format'}})
            return
 
        # do_create_bubble creates bubble and give edit lock to user
        # TODO: pass over also document_id to do_create_bubble when merging with Seungwoo's code
        try:
            result = do_create_normal_bubble(message.user.id, int(body['parent']), 
                    int(body['location']), True, body['content'])
        except:
            log.debug("do_create_normal_bubble failed")
            message.reply_channel.send({"text":
                    {'header': 'create_bubble', 'accept': 'False', 'body': 'create normal bubble failed'}})
            return

        if not result:
            log.debug("error occurred when creating new bubble at location=%d", body['location'])
            message.reply_channel.send({"text":
                    {"header": "create_bubble", "accept": 'False', "body": body}})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                {'header': 'create_bubble', 'accept': 'True', 
                'body': {'parent': body['parent'], 'location': body['location'], 'content': body['content']}}})
        return
    
    elif command == 'create_suggest_bubble':

        if set(body.keys()) != set(('binded_bubble', 'content')):
            log.debug("ws message unexpected format comand=%s", command)
            message.reply_channel.send({"text":
                    {'header': 'create_suggest_bubble', 'accept': 'False', 'body': 'body does not follow format'}})
            return

        try:
            # TODO: pass over also document_id
            result = do_create_suggest_bubble(message.user.id, int(body['binded_bubble']), body['content'])
        except:
            log.debug("do_create_suggest_bubble failed")
            message.reply_channel.send({"text":
                    {'header': 'create_suggest_bubble', 'accept': 'False', 'body': 'create suggest bubble failed'}})
            return

        if not result:
            log.debug("error occurred when creating new suggest bubble at bubble=%d", body['binded_bubble'])
            message.reply_channel.send({"text":
                    {'header': 'create_suggest_bubble', 'accept': 'False', 'body': body}})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                {'header': 'create_suggest_bubble', 'accept': 'True', 
                'body': {'binded_bubble': body['binded_bubble'], 'content': body['content']}}})
        return
    
    elif command == 'edit_bubble':
        if set(body.keys()) != set(('bubble_id', 'content')):
            log.debug('ws message unexpeced format command=%s', command)
            message.reply_channel.send({"text":
                {'header': 'edit_bubble', 'accept': 'False', 'body': 'body does not follow format'}})
            return

        try:
            result = do_edit_normal_bubble(message.user.id, int(body['bubble_id']), body['content'])
        except:
            log.debug("do_edit_normal_bubble failed")
            message.reply_channel.send({"text":
                {'header': 'edit_bubble', 'accept': 'False', 'body': 'edit bubble failed'}})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
            {'header': 'edit_bubble', 'accept': 'True', 
            'body': {'bubble_id': body['bubble_id'], 'content': body['content']}}})
        return
        
    elif command == 'delete_bubble':
        if set(body.keys()) != set(('bubble_id')):
            log.debug("ws message unexpected format command=%s", command)
            message.reply_channel.send({"text":
                    {'header': 'delete_bubble', 'accept': 'False', 'body': 'body does not follow format'}})
            return

        try:
            result = do_delete_normal_bubble(message.user.id, int(body['bubble_id']))
        except:
            log.debug("do_delete_normal_bubble failed")
            message.reply_channel.send({"text":
                    {"header": "delete_bubble", "accept": 'False', 'body': 'delete bubble failed'}})
            return
        
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                {'header': 'delete_bubble', 'accept': 'True', 'body': {'bubble_id': body['bubble_id']}}})
        return

    else:
        log.debug("ws message have invalid command=%s", command)
        message.reply_channel.send({"text":
                {"header": command, "accept": 'False', "body": "invalid command"}})
        return

#    try:
#        body = message.content['body']
#    except ValueError:
#        log.debug("ws message isn't json body=%s", body)
#        return
    
#    if set(body.keys()) != set(('handle', 'message')):
#        log.debug("ws message unexpected format command=%s", command)
#        return
    
#    if command:
#log.debug('message document_id=%s handle=%s message=%s',
#                document.id, body['handle'], body['message'])
#        Group('document_detail-'+id, channel_layer=message.channel_layer).send({'body': body})

@channel_session_user
def ws_disconnect(message):
    try:
        document_id = message.channel_session['document_id']
        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({'accept': True})
    except (KeyError, Document.DoesNotExist):
        message.reply_channel.send({'accept': True})
