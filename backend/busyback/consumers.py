import json
import logging
from django.http import HttpResponse
from django.forms.models import model_to_dict
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
        message.reply_channel.send({"text": 
                json.dumps({"header": "response", "accept": 'False', "body": "header and body needed"})})
        return
    except ValueError:
        message.reply_channel.send({"text":
                json.dumps({"header": "response", "accept": 'False', "body": "header and body needed"})})
        return
    
    if not command:
        message.reply_channel.send({"text":
                json.dumps({"header": "response", "accept": 'False', "body": "empty command"})})
        return

    if not body:
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "empty body"})})
        return

    #######################
    ##   Open Document   ##
    #######################

    if command == 'open_document':
        try:
            document_id = str(body['document_id'])
            document = Document.objects.get(id=int(document_id))
        except KeyError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "open_document", "accept": 'False', "body": "document_id needed"})})
            return
        except Document.DoesNotExist:
            message.reply_channel.send({"text":
                    json.dumps({"header": "open_document", "accept": 'False', "body": "document does not exist"})})
            return
 
        # Check if user is contributor of the document
        if not document.is_contributed_by(message.user.id):
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
    except KeyError:
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "request command without opening valid document"})})
        return
    except Document.DoesNotExist:
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "document does not exist"})})
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
        
        try:
            if not int(document_id) == int(body['document_id']):
                message.reply_channel.send({"text":
                        json.dumps({"header": command, "accept": 'False', "body": "attempt to close unopened document"})})
                return
        except KeyError:
            message.reply_channle.send({"text":
                    json.dumps({"header": command, "accept": "False", "body": "body does not follow format"})})

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
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_bubble_list", "accept": 'False', "body": "bubble does not exist for this document"})})
            return

        message.reply_channel.send({"text":
                json.dumps({"header": "get_bubble_list", "accept": 'True', "body": result})})
        return


    ##########################
    ##   Get Bubble w/ ID   ##
    ##########################
    
    elif command == 'get_bubble_by_id':

        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": 'get_bubble_by_id', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            result = do_fetch_normal_bubble(message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_bubble_by_id", "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_bubble_by_id", "accept": 'False', "body": "unknown error"})})
            return
            
        message.reply_channel.send({"text":
                json.dumps({"header": "get_bubble_by_id", "accept": 'True', "body": model_to_dict(result)})})
        return


    ##############################################
    ##   Get Suggest Bubble List for a Bubble   ##
    ##############################################

    elif command == 'get_suggest_bubble_list':

        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": 'get_suggest_bubble_list', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            # This function returns whole suggest bubble list, including those that are hided!
            result = do_fetch_suggest_bubbles(message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_suggest_bubble_list", "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_suggest_bubble_list", "accept": 'False', "body": "unknown error"})})
            return
            
        message.reply_channel.send({"text":
                json.dumps({"header": "get_suggest_bubble_list", "accept": 'True', "body": result})})
        return

 
    ##################################
    ##   Get Suggest Bubble w/ ID   ##
    ##################################

    elif command == 'get_suggest_bubble_by_id':

        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": 'get_suggest_bubble_by_id', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            result = do_fetch_suggest_bubble(message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_suggest_bubble_by_id", "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "get_suggest_bubble_by_id", "accept": 'False', "body": "unknown error"})})
            return
            
        message.reply_channel.send({"text":
                json.dumps({"header": "get_suggest_bubble_by_id", "accept": 'True', "body": model_to_dict(result)})})
        return



    ################################
    ##   Get Comment for Bubble   ##
    ################################
 
    ########################################
    ##   Get Comment for Suggest Bubble   ##
    ########################################
 

    #######################
    ##   Create Bubble   ##
    #######################

    elif command == 'create_bubble':
      
        if set(body.keys()) != set(('parent', 'location', 'content')):
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
        except:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_bubble', 'accept': 'False', 'body': 'unknown error'})})
            return
        

        if not result:
            message.reply_channel.send({"text":
                    json.dumps({"header": "create_bubble", "accept": 'False', "body": body})})
            return

        diction = model_to_dict(result)
        diction.update({'who': message.user.id})

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'create_bubble', 'accept': 'True', 
                'body': diction})})
        return


    ###############################
    ##   Create Suggest Bubble   ##
    ###############################

    elif command == 'create_suggest_bubble':

        if set(body.keys()) != set(('binded_bubble', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            result = do_create_suggest_bubble(message.user.id, int(document_id),
                    int(body['binded_bubble']), body['content'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False', 'body': 'bubble does not exist for the id'})})
            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False',
                            'body': 'root bubble cannot have suggest bubble'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False', 'body': 'create suggest bubble failed'})})
            return

        if not result:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'create_suggest_bubble', 'accept': 'False', 'body': body})})
            return

        diction = model_to_dict(result)
        diction.update({'who': message.user.id})

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'create_suggest_bubble', 'accept': 'True', 
                'body': diction})})
        return
 

    #########################################
    ##   Create Comment on Normal Bubble   ##
    #########################################


    ##########################################
    ##   Create Comment on Suggest Bubble   ##
    ##########################################
   

    #####################
    ##   Edit Bubble   ##
    #####################

    elif command == 'edit_bubble':
        if set(body.keys()) != set(('bubble_id', 'content')):
            message.reply_channel.send({"text":
                json.dumps({'header': 'edit_bubble', 'accept': 'False',
                        'body': 'body does not follow format'})})
            return

        try:
            result = do_edit_normal_bubble(message.user.id, int(document_id),
                    int(body['bubble_id']), body['content'])
        except BubbleIsInternalError:
            message.reply_channel.send({"text":
                json.dumps({'header': 'edit_bubble', 'accept': 'False',
                        'body': 'cannot edit internal bubble'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                json.dumps({'header': 'edit_bubble', 'accept': 'False',
                        'body': 'it is being editted by another contributor'})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                json.dumps({'header': 'edit_bubble', 'accept': 'False',
                        'body': 'cannot edit bubble that is being claimed ownership of'})})
            return
        except:
            message.reply_channel.send({"text":
                json.dumps({'header': 'edit_bubble', 'accept': 'False', 'body': 'unknown error'})})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
            json.dumps({'header': 'edit_bubble', 'accept': 'True', 
            'body': {'who': message.user.id, 'bubble_id': body['bubble_id'], 'content': body['content']}})})
        return


    ##########################################
    ##   Currently Editting Normal Bubble   ##
    ##########################################

   

    #######################################
    ##   Finish Editting Normal Bubble   ##
    #######################################

    elif command == 'finish_editting_bubble':

        if set(body.keys()) != set(('bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({"header": 'finish_editting_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        
        try:
            # TODO: call appropriate function & change the name into do_unlock_normal_bubble
            do_unlock_bubble(message.user.id, int(document_id), int(body['bubble_id']))

        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'finish_editting_bubble', 'accept': 'False', 'body': 'bubble does not exist for the id'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'finish_editting_bubble', 'accept': 'False', 'body': 'bubble is being editted by another contributor'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({'header': 'finish_editting_bubble', 'accept': 'False', 'body': 'unknown error'})})
            return

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'finish_editting_bubble', 'accept': 'True', 
                'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return


    ########################################
    ##   Discard Editting Normal Bubble   ##
    ########################################

    #####################################
    ##   Release Ownership of Bubble   ##
    #####################################



    #######################
    ##   Delete Bubble   ##
    #######################

    elif command == 'delete_bubble':
        if set(body.keys()) != set(('bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'delete_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            result = do_delete_normal_bubble(message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "delete_bubble", "accept": 'False', 'body': 'root bubble cannot be deleted'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "delete_bubble", "accept": 'False', 'body': 'bubble is being editted'})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "delete_bubble", "accept": 'False', 'body': 'bubble is being claimed ownership'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "delete_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
        
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'delete_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return


    #############################
    ##   Hide Suggest Bubble   ##
    #############################

    elif command == 'hide_suggest_bubble':
        if set(body.keys()) != set(('suggest_bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'hide_suggest_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            do_hide_suggest_bubble(message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "hide_suggest_bubble", "accept": 'False',
                            'body': 'suggest bubble does not exist for the id'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "hide_suggest_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
        
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'hide_suggest_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return
 

    #############################
    ##   Show Suggest Bubble   ##
    #############################

    elif command == 'show_suggest_bubble':
        if set(body.keys()) != set(('suggest_bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'show_suggest_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            do_show_suggest_bubble(message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "show_suggest_bubble", "accept": 'False',
                            'body': 'suggest bubble does not exist for the id'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "show_suggest_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
        
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'show_suggest_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return
 

    #########################################
    ##   Delete Comment on Normal Bubble   ##
    #########################################


    ##########################################
    ##   Delete Comment on Suggest Bubble   ##
    ##########################################

        
    #####################
    ##   Move Bubble   ##
    #####################

    elif command == 'move_bubble':
        if set(body.keys()) != set(('buble_id', 'new_parent_id', 'new_location')):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'move_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            do_move_normal_bubble(message.user.id, int(document_id), int(body['bubble_id']),
                    int(body['new_parent_id']), int(body['new_location']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "move_bubble", "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "move_bubble", "accept": 'False',
                            'body': 'new parent bubble is leaf bubble'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "move_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
                            
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'move_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id'],
                        'new_parent_id': body['new_parent_id'], 'new_location': body['new_location']}})})
        return
 

    #######################################
    ##   Move Comment on Normal Bubble   ##
    #######################################


    ########################################
    ##   Move Comment on Suggest Bubble   ##
    ########################################


    #####################
    ##   Wrap Bubble   ##
    #####################

    elif command == 'wrap_bubble':
        if set(body.keys()) != set(('bubble_id_list',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'wrap_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            do_wrap_normal_bubble(message.user.id, int(document_id), body['bubble_id_list'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "move_bubble", "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidWrapError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "move_bubble", "accept": 'False',
                            'body': 'this kind of wrap cannot happen'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "move_bubble", "accept": 'False',
                            'body': "one of bubbles' relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "wrap_bubble", "accept": "False",
                            'body': 'one of bubbles is being claimed ownership of'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "wrap_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
                            
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'wrap_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id_list': body['bubble_id_list']}})})
        return


    ###############################
    ##   Split Internal Bubble   ##
    ###############################

        
    ###########################
    ##   Split Leaf Bubble   ##
    ###########################

    elif command == 'split_leaf_bubble':
        if set(body.keys()) != set(('bubble_id', 'split_content_list')):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'split_leaf_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            do_wrap_normal_bubble(message.user.id, int(document_id), int(body['bubble_id']), body['split_content_list'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "split_leaf_bubble", "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidSplitError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "split_leaf_bubble", "accept": 'False',
                            'body': 'this kind of wrap cannot happen'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "split_leaf_bubble", "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "split_leaf_bubble", "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})
            return
        except BubbleIsInternalError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "split_leaf_bubble", "accept": "False",
                            'body': 'internal bubble cannot be handled by split_leaf_bubble'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "split_leaf_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
                            
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'split_leaf_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id'],
                        'split_content_list': body['split_content_list']}})})
        return
 

    ######################
    ##   Merge Bubble   ##
    ######################


    ####################
    ##   Pop Bubble   ##
    ####################

    elif command == 'pop_bubble':
        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'pop_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            do_wrap_normal_bubble(message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "pop_bubble", "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "pop_bubble", "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "pop_bubble", "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})

            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "pop_bubble", "accept": "False",
                            'body': 'leaf bubble cannot be popped'})})

            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "pop_bubble", "accept": 'False',
                            'body': 'root bubble cannot be popped'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "pop_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
                            
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'pop_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return
 

    ########################################
    ##   Switch Bubble w/ Suggest Bubble  ##
    ########################################

    elif command == 'switch_bubble':
        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'switch_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            do_wrap_normal_bubble(message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "switch_bubble", "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "switch_bubble", "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "switch_bubble", "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "switch_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
                            
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'switch_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return
    

    ################################
    ##   Vote on Suggest Bubble   ##
    ################################

    elif command == 'vote_on_suggest_bubble':
        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'vote_on_suggest_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            # TODO: change the name into do_vote_suggest_bubble
            do_vote_bubble(message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": "vote_on_suggest_bubble", "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except:
            message.reply_channel.send({"text":
                    json.dumps({"header": "vote_on_suggest_bubble", "accept": 'False', 'body': 'unknown error'})})
            return
                            
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'pop_bubble', 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return
 

    #########################################
    ##   If you came here, it's wrong...   ##
    #########################################


    else:
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'False', "body": "invalid command"})})
        return



@channel_session_user
def ws_disconnect(message):
    try:
        document_id = message.channel_session['document_id']
        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({'accept': True})
    except (KeyError, Document.DoesNotExist):
        message.reply_channel.send({'accept': True})
