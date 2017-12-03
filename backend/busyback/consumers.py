import json
import logging
from django.http import HttpResponse
from channels import Channel, Group
from channels.handler import AsgiHandler
from channels.sessions import channel_session, enforce_ordering
from channels.auth import channel_session_user, channel_session_user_from_http
from channels.auth import http_session
from .models import *
from .bubbles import *
from .errors import *
import logging
import pdb

# reference: antilibrary.or/1117, channels.readthedocs.io/en/stable/getting-started.html

log = logging.getLogger(__name__)


@channel_session_user_from_http
def ws_connect(message):
    if not message.user.is_authenticated:
        message.reply_channel.send({"accept": False})
        return
    message.reply_channel.send({"accept": True})


# TODO: enforce_ordering does not work... need to handle this manually
# Enforce ordering for security issue, at the expense of performance
@channel_session_user
# @enforce_ordering
def ws_receive(message):
    try:
        text = json.loads(message.content['text'].replace("'", "\""))
        command = text['header']
        body = text['body']
    except KeyError:
        log.debug("ws message doesn't have header")
        message.reply_channel.send({"text": 
                json.dumps({"header": "response", "accept": 'False', "body": "header and body needed"})})
        return
    except ValueError:
        log.debug("ws message doesn't have proper body")
        message.reply_channel.send({"text":
                json.dumps({"header": "response", "accept": 'False', "body": "header and body needed"})})
        return
    
    if not command:
        log.debug("ws message have invalid command")
        message.reply_channel.send({"text":
                json.dumps({"header": "response", "accept": 'False', "body": "empty command"})})
        return

    if not body:
        log.debug("ws message have invalid body")
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "empty body"})})
        return

    #######################
    ##   Open Document   ##
    #######################

    if command == 'open_document':
        try:
            document_id = body['document_id']
            document = Document.objects.get(id=int(document_id))
        except KeyError:
            log.debug("open_document doesn't have document_id filed in body")
            message.reply_channel.send({"text":
                    json.dumps({"header": "open_document", "accept": 'False', "body": "document_id needed"})})
            return
        except Document.DoesNotExist:
            log.debug('document does not exist for id=%s', document_id)
            message.reply_channel.send({"text":
                    json.dumps({"header": "open_document", "accept": 'False', "body": "document does not exist"})})
            return
 
        # Check if user is contributor of the document
        if not document.is_contributed_by(message.user.id):
            log.debug('document has no contributor with id=%d', message.user.id)
            message.reply_channel.send({"text":
                    json.dumps({"header": "open_document", "accept": 'False', "body": "user does not contribute to the document"})})
            return

        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).add(message.reply_channel)
        message.channel_session['document_id'] = str(document_id)
        message.reply_channel.send({"text":
                json.dumps({"header": "open_document", "accept": 'True', "body": {"document_id": document_id}})})
        return


    #####################
    ##   Common code   ##
    #####################
 
    # Look up the document from the channel session, bailing if it doesn't exist
    try:
        document_id = str(message.channel_session['document_id'])
        document = Document.objects.get(id=int(document_id))
        log.debug('received message, document exist id=%s', document.id)
    except KeyError:
        log.debug('no document in channel_session')
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "request command without opening valid document"})})
        return
    except Document.DoesNotExist:
        log.debug('received message, but document does not exist for id=%s', document_id)
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "request command without opening valid document"})})
        return

    # Double check if user is contributor of the document
    if not document.is_contributed_by(message.user.id):
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "user does not contribute to the document"})})
        return


    ########################
    ##   Close Document   ##
    ########################
  
    if command == 'close_document':
       
        if not int(document_id) == int(body['document_id']):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "attempt to close unopened document"})})
            return

        Group('document_id-'+str(document_id), channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": {"document_id": body['document_id']}})})
        return 
      

    #########################
    ##   Get Bubble List   ##
    #########################

    elif command == 'get_bubble_list':

        try:
            result = do_fetch_normal_bubbles(message.user.id, int(document_id))
        except UserIsNotContributorError:
            # Do nothing since it cannot happen
            return

        if not result:
            log.debug("there is not any bubble for document=%s", document_id)
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_bubble_list", "accept": 'False', "body": "bubble does not exist for this document"})})
            return

        message.reply_channel.send({"text":
                json.dumps({"header": "get_bubble_list", "accept": 'True', "body": {"content": result}})})
        return


    ##########################
    ##   Get Bubble w/ ID   ##
    ##########################
    
    elif command == 'get_bubble_by_id':
    
        try:
            result = do_fetch_bubble(message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_bubble_by_id", "accept": 'False', "body": "bubble does not exist for the id"})})
            return
            
        message.reply_channel.send({"text":
                json.dumps({"header": "get_bubble_by_id", "accept": 'True', "body": {"content": result}})})
        return


    #######################
    ##   Create Bubble   ##
    #######################

    elif command == 'create_bubble':
      
        if set(body.keys()) != set(('parent', 'location', 'content')):
            log.debug("ws message unexpected format command=%s", command)
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
 
        # do_create_bubble creates bubble and give edit lock to user
        try:
            result = do_create_normal_bubble(message.user.id, int(document_id), 
                    int(body['parent']), int(body['location']), True, body['content'])
        except InvalidLocationError:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_bubble', 'accept': 'False', 'body': 'invalid location'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_bubble', 'accept': 'False', 'body': 'parent or ancestor is under edit'})})
            return

        if not result:
            log.debug("error occurred when creating new bubble at location=%d", body['location'])
            message.reply_channel.send({"text":
                    json.dumps({"header": "create_bubble", "accept": 'False', "body": body})})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'create_bubble', 'accept': 'True', 
                'body': {'parent': body['parent'], 'location': body['location'], 'content': body['content']}})})
        return
    

    ###############################
    ##   Create Suggest Bubble   ##
    ###############################

    elif command == 'create_suggest_bubble':

        if set(body.keys()) != set(('binded_bubble', 'content')):
            log.debug("ws message unexpected format comand=%s", command)
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            # TODO: pass over also document_id
            result = do_create_suggest_bubble(message.user.id, int(document_id),
                    int(body['binded_bubble']), body['content'])
        except:
            log.debug("do_create_suggest_bubble failed")
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False', 'body': 'create suggest bubble failed'})})
            return

        if not result:
            log.debug("error occurred when creating new suggest bubble at bubble=%d", body['binded_bubble'])
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False', 'body': body})})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'create_suggest_bubble', 'accept': 'True', 
                'body': {'binded_bubble': body['binded_bubble'], 'content': body['content']}})})
        return
    

    #####################
    ##   Edit Bubble   ##
    #####################

    elif command == 'edit_bubble':
        if set(body.keys()) != set(('bubble_id', 'content')):
            log.debug('ws message unexpeced format command=%s', command)
            message.reply_channel.send({"text":
                json.dumps({'header': 'edit_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            result = do_edit_normal_bubble(message.user.id, int(document_id),
                    int(body['bubble_id']), body['content'])
        except:
            log.debug("do_edit_normal_bubble failed")
            message.reply_channel.send({"text":
                json.dumps({'header': 'edit_bubble', 'accept': 'False', 'body': 'edit bubble failed'})})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
            json.dumps({'header': 'edit_bubble', 'accept': 'True', 
            'body': {'bubble_id': body['bubble_id'], 'content': body['content']}})})
        return
    

    #######################
    ##   Delete Bubble   ##
    #######################

    elif command == 'delete_bubble':
        if set(body.keys()) != set(('bubble_id')):
            log.debug("ws message unexpected format command=%s", command)
            message.reply_channel.send({"text":
                    json.dumps({'header': 'delete_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            result = do_delete_normal_bubble(message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "delete_bubble", "accept": 'False', 'body': 'bubble is root'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "delete_bubble", "accept": 'False', 'body': 'bubble is being editted'})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "delete_bubble", "accept": 'False', 'body': 'bubble is being claimed ownership'})})
            return 
        
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'delete_bubble', 'accept': 'True', 'body': {'bubble_id': body['bubble_id']}})})
        return


    #####################
    ##   Wrap Bubble   ##
    #####################


    ######################
    ##   Merge Bubble   ##
    ######################



    else:
        log.debug("ws message have invalid command=%s", command)
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "invalid command"})})
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
