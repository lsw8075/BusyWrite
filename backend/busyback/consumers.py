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
from .documents import *
from .comments import *
from .users import *
from .notes import *
from .utils import see_error
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
        text = json.loads(message.content['text'].replace("'", '"'))
        command = text['header']
        previous_state = text['previous_request']
        body = text['body']
    except KeyError:
        message.reply_channel.send({"text":
                json.dumps({"header": "response", "accept": 'False', "body": "header, body, previous_request needed"})})
        return
    except ValueError:
        message.reply_channel.send({"text":
                json.dumps({"header": "response", "accept": 'False', "body": "header, body, previous_request needed"})})
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
                    json.dumps({"header": command, "accept": 'False', "body": "document_id needed"})})
            return
        except Document.DoesNotExist:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "document does not exist"})})
            return

        # Check if user is contributor of the document
        if not document.is_contributed_by(message.user.id):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "user does not contribute to the document"})})
            return

        try:
            result = do_user_connect_document(message.user.id, int(document_id))
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "adding user failed"})})
            return

        try:
            contributors = do_fetch_contributors(message.user.id, int(document_id))
            connectors = do_get_connected_users_document(message.user.id, int(document_id))
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "getting contributors failed"})})
            see_error(e)
            return

        message.channel_session['document_id'] = str(document_id)
        # contributors and connectors would include herself! Be careful when using.
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True',
                        "body": {"document_id": document_id, "previous_request_id": result,
                        "contributors": contributors, "connectors": connectors}})})

        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).add(message.reply_channel)

        # Let people in the group know that new person opened document detail page of this document
        # tried sending before adding this person to the group but the message was sent to this person too
        # so just send after adding
        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).send({"text":
                json.dumps({"header": "someone_open_document_detail", "accept": 'True',
                        "body": {"id": message.user.id, "email": message.user.email}})})

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

        try:
            do_user_disconnect_document(message.user.id, int(document_id))
        except Exception as e:
            message.reply_channle.send({"text":
                    json.dumps({"header": command, "accept": "False", "body": "cannot disconnect this user"})})

        Group('document_id-'+str(document_id), channel_layer=message.channel_layer).discard(message.reply_channel)
        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": {"document_id": body['document_id']}})})

        # Let other people in the group know that this person closed document detail page of this document
        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).send({"text":
                json.dumps({"header": "someone_close_document_detail", "accept": 'True', "body": {"id": message.user.id, "email": message.user.email}})})

        return


    #########################
    ##   Get Bubble List   ##
    #########################

    elif command == 'get_bubble_list':

        try:
            result = do_fetch_normal_bubbles(previous_state, message.user.id, int(document_id))
        except UserIsNotContributorError:
            # Do nothing since it cannot happen
            return

        if not result:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for this document"})})
            return

        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": result})})
        return


    ##########################
    ##   Get Bubble w/ ID   ##
    ##########################

    elif command == 'get_bubble_by_id':

        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            result = do_fetch_normal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "unknown error"})})
            see_error(e)
            return

        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": result})})
        return


    ##############################################
    ##   Get Suggest Bubble List for a Bubble   ##
    ##############################################

    elif command == 'get_suggest_bubble_list':

        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            # This function returns whole suggest bubble list, including those that are hided!
            result = do_fetch_suggest_bubbles(previous_state, message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "unknown error"})})
            see_error(e)
            return

        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": result})})
        return


    ##################################
    ##   Get Suggest Bubble w/ ID   ##
    ##################################

    elif command == 'get_suggest_bubble_by_id':

        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            result = do_fetch_suggest_bubble(previous_state, message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "unknown error"})})
            see_error(e)
            return

        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": result})})
        return


    ################################
    ##   Get Comment for Bubble   ##
    ################################

    elif command == 'get_comment_list_for_bubble':

        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            result = do_fetch_comments_under_normal(previous_state, message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "unknown error"})})
            see_error(e)
            return

        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": result})})
        return


    ########################################
    ##   Get Comment for Suggest Bubble   ##
    ########################################

    elif command == 'get_comment_list_for_suggest_bubble':

        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            result = do_fetch_comments_under_suggest(previous_state, message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "suggest bubble does not exist for the id"})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "unknown error"})})
            see_error(e)
            return

        message.reply_channel.send({"text":
                json.dumps({"header": command, "accept": 'True', "body": result})})
        return



    #######################
    ##   Create Bubble   ##
    #######################

    elif command == 'create_bubble':

        if set(body.keys()) != set(('parent_id', 'location', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        # do_create_bubble creates bubble and give edit lock to user
        try:
            # TODO: give ownership to user. change False -> True
            get = do_create_normal_bubble(previous_state, message.user.id, int(document_id),
                    int(body['parent_id']), int(body['location']), False, body['content'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidLocationError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'invalid location'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'parent or ancestor is under edit'})})
            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'parent bubble is leaf bubble'})})
            return 
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'create bubble failed'})})
            see_error(e)
            return


        if not get:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        result.update({'who': message.user.id})

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True', 'body': result})})
        return


    ###############################
    ##   Create Suggest Bubble   ##
    ###############################

    elif command == 'create_suggest_bubble':

        if set(body.keys()) != set(('binded_bubble_id', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_create_suggest_bubble(previous_state, message.user.id, int(document_id),
                    int(body['binded_bubble_id']), body['content'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'bubble does not exist for the id'})})
            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'root bubble cannot have suggest bubble'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'create suggest bubble failed'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'function returned null'})})
            return

        request_id = get[0]
        result = get[1]
        result.update({'who': message.user.id})

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True', 'body': result})})
        return


    #########################################
    ##   Create Comment on Normal Bubble   ##
    #########################################

    elif command == 'create_comment_on_bubble':

        # IMPORTANT: order should be generated by server!
        if set(body.keys()) != set(('binded_bubble_id', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_create_comment_under_normal(previous_state, message.user.id, int(document_id),
                    int(body['binded_bubble_id']), body['content'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'create comment on bubble failed'})})
            see_error(e)
            return


        if not get:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];
        result.update({'who': message.user.id})

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True', 'body': result})})
        return



    ##########################################
    ##   Create Comment on Suggest Bubble   ##
    ##########################################

    elif command == 'create_comment_on_suggest_bubble':

        if set(body.keys()) != set(('binded_suggest_bubble_id', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'body does not follow format'})})
            return

        try:
            get = do_create_comment_under_suggest(previous_state, message.user.id, int(document_id),
                    int(body['binded_suggest_bubble_id']), body['content'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'suggest bubble does not exist for the id'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'create comment on suggest bubble failed'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];
        result.update({'who': message.user.id})

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True', 'body': result})})
        return


    #####################
    ##   Edit Bubble   ##
    #####################

    elif command == 'edit_bubble':
        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'body does not follow format'})})
            return

        try:
            # TODO: remove content field of the function
            get = do_edit_normal_bubble(previous_state, message.user.id, int(document_id),
                    int(body['bubble_id']), '')
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except BubbleIsInternalError:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'cannot edit internal bubble'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'it is being editted by another contributor'})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'cannot edit bubble that is being claimed ownership of'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
            json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
            'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return


    ##########################################
    ##   Currently Editting Normal Bubble   ##
    ##########################################

    elif command == 'update_content_of_editting_bubble':
        if set(body.keys()) != set(('bubble_id', 'content')):
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'body does not follow format'})})
            return

        try:
            # TODO: remove content field of the function
            get = do_updating_normal_bubble(previous_state, message.user.id, int(document_id),
                    int(body['bubble_id']), body['content'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return
        except InvalidUpdateError:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'update failed'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        request_id = get[0];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
            json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
            'body': {'who': message.user.id, 'bubble_id': body['bubble_id'], 'content': body['content']}})})
        return


    #######################################
    ##   Finish Editting Normal Bubble   ##
    #######################################

    elif command == 'finish_editting_bubble':

        if set(body.keys()) != set(('bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            # TODO: call appropriate function & change the name into do_unlock_normal_bubble
            get = do_update_finish_normal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']))

        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'bubble does not exist for the id'})})
            return
        except InvalidUpdateError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'update finish failed'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                'body': {'who': message.user.id, 'bubble_id': body['bubble_id'], 'content': result['content']}})})
        return


    ########################################
    ##   Discard Editting Normal Bubble   ##
    ########################################

    elif command == 'discard_editting_bubble':

        if set(body.keys()) != set(('bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            # TODO: call appropriate function & change the name into do_unlock_normal_bubble
            get = do_update_discard_normal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']))

        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'bubble does not exist for the id'})})
            return
        except InvalidUpdateError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'update discard failed'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                'body': {'who': message.user.id, 'bubble_id': body['bubble_id'], 'content': result['content']}})})
        return


    #####################################
    ##   Release Ownership of Bubble   ##
    #####################################

    elif command == 'release_ownership_of_bubble':
        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'body does not follow format'})})
            return

        try:
            get = do_release_ownership(previous_state, message.user.id, int(document_id), int(body['bubble_id']))

        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', "body": "bubble does not exist for the id"})})
            return

        except BubbleNotOwnedError:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'this bubble is not owned by anyone'})})
            return

        except BubbleOwnedError:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False',
                        'body': 'owner of this bubble is not this user'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                json.dumps({'header': command, 'accept': 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
            json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
            'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return


    #############################
    ##   Edit Suggest Bubble   ##
    #############################

    elif command == 'edit_suggest_bubble':

        if set(body.keys()) != set(('suggest_bubble_id', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_edit_suggest_bubble(previous_state, message.user.id, int(document_id),
                    int(body['suggest_bubble_id']), body['content'])

        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'suggest bubble does not exist for the id'})})
            return
        except ContentEmptyError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'empty content'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                'body': {'who': message.user.id, 'hided_suggest_bubble_id': body['suggest_bubble_id'],
                'new_editted_suggest_bubble': result}})})
        return


    #######################################
    ##   Edit Comment on Normal Bubble   ##
    #######################################

    elif command == 'edit_comment_on_bubble':

        if set(body.keys()) != set(('comment_id', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_edit_comment_under_normal(previous_state, message.user.id, int(document_id),
                    int(body['comment_id']), body['content'])

        except CommentDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'comment does not exist for the id'})})
            return
        except UserIsNotCommentOwnerError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'this user did not write this comment'})})
            return
        except ContentEmptyError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'empty content'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'edit comment failed'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                'body': {'who': message.user.id, 'comment_id': body['comment_id'],
                'content': body['content']}})})
        return


    ########################################
    ##   Edit Comment on Suggest Bubble   ##
    ########################################

    elif command == 'edit_comment_on_suggest_bubble':

        if set(body.keys()) != set(('comment_id', 'content')):
            message.reply_channel.send({"text":
                    json.dumps({"header": command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_edit_comment_under_suggest(previous_state, message.user.id, int(document_id),
                    int(body['comment_id']), body['content'])

        except CommentDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'comment does not exist for the id'})})
            return
        except UserIsNotCommentOwnerError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'this user did not write this comment'})})
            return
        except ContentEmptyError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'empty content'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'edit comment failed'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                'body': {'who': message.user.id, 'comment_id': body['comment_id'],
                'content': body['content']}})})
        return


    #######################
    ##   Delete Bubble   ##
    #######################

    elif command == 'delete_bubble':
        if set(body.keys()) != set(('bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_delete_normal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False", "body": 'bubble does not exist for the id'})})
            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'root bubble cannot be deleted'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'bubble is being editted'})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'bubble is being claimed ownership'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': 'delete_bubble', 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return


    #############################
    ##   Hide Suggest Bubble   ##
    #############################

    elif command == 'hide_suggest_bubble':
        if set(body.keys()) != set(('suggest_bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_hide_suggest_bubble(previous_state, message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'suggest bubble does not exist for the id'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return


    #############################
    ##   Show Suggest Bubble   ##
    #############################

    elif command == 'show_suggest_bubble':
        if set(body.keys()) != set(('suggest_bubble_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_show_suggest_bubble(previous_state, message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'suggest bubble does not exist for the id'})})
            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'cannot add suggest bubble to root bubble'})})
            return

        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return


    #########################################
    ##   Delete Comment on Normal Bubble   ##
    #########################################

    elif command == 'delete_comment_on_bubble':
        if set(body.keys()) != set(('comment_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_delete_comment_under_normal(previous_state, message.user.id, int(document_id), int(body['comment_id']))
        except CommentDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False", "body": 'comment does not exist for the id'})})
            return
        except UserIsNotCommentOwnerError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'this user did not write this comment'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'comment_id': body['comment_id']}})})
        return


    ##########################################
    ##   Delete Comment on Suggest Bubble   ##
    ##########################################

    elif command == 'delete_comment_on_suggest_bubble':
        if set(body.keys()) != set(('comment_id',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return

        try:
            get = do_delete_comment_under_suggest(previous_state, message.user.id, int(document_id), int(body['comment_id']))
        except CommentDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False", "body": 'comment does not exist for the id'})})
            return
        except UserIsNotCommentOwnerError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'this user did not write this comment'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'comment_id': body['comment_id']}})})
        return



    #####################
    ##   Move Bubble   ##
    #####################

    elif command == 'move_bubble':
        if set(body.keys()) != set(('bubble_id', 'new_parent_id', 'new_location')):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_move_normal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']),
                    int(body['new_parent_id']), int(body['new_location']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'new parent bubble is leaf bubble'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id'],
                        'new_parent_id': body['new_parent_id'], 'new_location': body['new_location']}})})
        return


    #####################
    ##   Wrap Bubble   ##
    #####################

    elif command == 'wrap_bubble':
        if set(body.keys()) != set(('wrap_bubble_id_list',)):
            message.reply_channel.send({"text":
                    json.dumps({'header': 'wrap_bubble', 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_wrap_normal_bubble(previous_state, message.user.id, int(document_id), body['wrap_bubble_id_list'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidWrapError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'this kind of wrap cannot happen'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': "one of bubbles' relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'one of bubbles is being claimed ownership of'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'wrap_bubble_id_list': body['wrap_bubble_id_list'],
                        'new_wrapped_bubble': result}})})
        return


    ####################
    ##   Pop Bubble   ##
    ####################

    elif command == 'pop_bubble':
        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_pop_normal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})
            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'leaf bubble cannot be popped'})})
            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'root bubble cannot be popped'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error: ' + str(e)})})
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return


    ###############################
    ##   Split Internal Bubble   ##
    ###############################

    elif command == 'split_internal_bubble':
        if set(body.keys()) != set(('bubble_id', 'split_bubble_id_list')):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_split_internal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']), body['split_bubble_id_list'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidSplitError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'this kind of wrap cannot happen'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})
            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'leaf bubble cannot be handled by split_internal_bubble'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        ## TODO: Change do_split_internal_bubble
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id'],
                        'split_bubble_object_list': result,
                        'split_bubble_id_list': body['split_bubble_id_list']}})})
        return


    ###########################
    ##   Split Leaf Bubble   ##
    ###########################

    elif command == 'split_leaf_bubble':
        if set(body.keys()) != set(('bubble_id', 'split_content_list')):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_split_leaf_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']), body['split_content_list'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidSplitError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'this kind of wrap cannot happen'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})
            return
        except BubbleIsInternalError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'internal bubble cannot be handled by split_leaf_bubble'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        ## TODO: Change do_split_leaf_bubble
        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id'],
                        'split_bubble_object_list': result,
                        'split_content_list': body['split_content_list']}})})
        return
        # [d['id'] for d in list(result.child_bubbles.all().values()]



    ######################
    ##   Merge Bubble   ##
    ######################

    elif command == 'merge_bubble':
        if set(body.keys()) != set(('merge_bubble_id_list', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_merge_normal_bubble(previous_state, message.user.id, int(document_id), body['merge_bubble_id_list'])
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})

            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'root bubble cannot be merged'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'merge_bubble_id_list': body['merge_bubble_id_list'],
                        'merged_bubble': result}})})
        return


    ########################
    ##   Flatten Bubble   ##
    ########################

    elif command == 'flatten_bubble':
        if set(body.keys()) != set(('bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_flatten_normal_bubble(previous_state, message.user.id, int(document_id), int(body['bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})

            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'leaf bubble cannot be flattened'})})
            return
        except BubbleIsRootError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'root bubble cannot be flattened'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'bubble_id': body['bubble_id']}})})
        return


    ########################################
    ##   Switch Bubble w/ Suggest Bubble  ##
    ########################################

    elif command == 'switch_bubble':
        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_switch_bubble(previous_state, message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': "one of new parent bubble's relatives is being editted"})})
            return
        except BubbleOwnedError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": "False",
                            'body': 'bubble is being claimed ownership of'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return
        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return


    ################################
    ##   Vote on Suggest Bubble   ##
    ################################

    elif command == 'vote_on_suggest_bubble':
        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_vote_suggest_bubble(previous_state, message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return


    ##################################
    ##   Unvote on Suggest Bubble   ##
    ##################################

    elif command == 'unvote_on_suggest_bubble':
        if set(body.keys()) != set(('suggest_bubble_id', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_unvote_suggest_bubble(previous_state, message.user.id, int(document_id), int(body['suggest_bubble_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'suggest_bubble_id': body['suggest_bubble_id']}})})
        return


    ##################
    ##   Get Note   ##
    ##################

    # will be done by http(get)

    #####################
    ##   Create Note   ##
    #####################

    # will be done by http(post)

    #####################
    ##   Delete Note   ##
    #####################

    # will be done by http(:id/delete)

    ##############################
    ##   Change order of Note   ##
    ##############################

    # will be done by html(:id/put)

    ###########################
    ##   Update(Edit) Note   ##
    ###########################

    # will be done by html(:id/put)

    ####################################
    ##   Export Note as Leaf Bubble   ##
    ####################################

    elif command == 'export_note_as_bubble':
        if set(body.keys()) != set(('parent_id', 'location', 'note_id' )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_export_note_to_normal(previous_state, message.user.id, int(document_id),
                    int(body['parent_id']), int(body['location']), int(body['note_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidLocationError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'invalid location'})})
            return
        except BubbleLockedError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'parent or ancestor is under edit'})})
            return
        except BubbleIsLeafError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'parent bubble is leaf bubble'})})
            return
 
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return
        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'new_bubble': result}})})
        return



    #######################################
    ##   Export Note as Suggest Bubble   ##
    #######################################

    elif command == 'export_note_as_suggest_bubble':
        if set(body.keys()) != set(('binded_bubble_id', 'note_id' )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_export_note_to_suggest(previous_state, message.user.id, int(document_id),
                    int(body['binded_bubble_id']), int(body['note_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except InvalidLocationError:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'invalid location'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'new_suggest_bubble': result}})})
        return


    #################################################
    ##   Export Note as Comment on Normal Bubble   ##
    #################################################

    elif command == 'export_note_as_comment_under_bubble':
        if set(body.keys()) != set(('binded_bubble_id', 'note_id' )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_export_note_to_comment_under_normal(previous_state, message.user.id, int(document_id),
                    int(body['binded_bubble_id']), int(body['note_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'new_comment': result}})})
        return


    ##################################################
    ##   Export Note as Comment on Suggest Bubble   ##
    ##################################################

    elif command == 'export_note_as_comment_under_suggest_bubble':
        if set(body.keys()) != set(('binded_suggest_bubble_id', 'note_id' )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_export_note_to_comment_under_normal(previous_state, message.user.id, int(document_id),
                    int(body['binded_suggest_bubble_id']), int(body['note_id']))
        except BubbleDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'bubble does not exist for the id'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'new_comment': result}})})
        return


    ###############################
    ##   Change Document Title   ##
    ###############################

    elif command == 'change_title_of_document':
        if set(body.keys()) != set(('new_title', )):
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False', 'body': 'body does not follow format'})})
            return
        try:
            get = do_change_title_of_document(previous_state, message.user.id, int(document_id),
                    str(body['new_title']))
        except DocumentDoesNotExistError:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False',
                            'body': 'document does not exist for the id'})})
            return
        except Exception as e:
            message.reply_channel.send({"text":
                    json.dumps({"header": command, "accept": 'False', 'body': 'unknown error'})})
            see_error(e)
            return

        if not get:
            message.reply_channel.send({"text":
                    json.dumps({'header': command, 'accept': 'False',
                            'body': 'function returned null'})})
            return

        request_id = get[0];
        result = get[1];

        Group('document_detail-'+document_id, channel_layer=message.channel_layer).send({"text":
                json.dumps({'header': command, 'request_id': request_id, 'accept': 'True',
                        'body': {'who': message.user.id, 'new_title': body['new_title']}})})
        return


    #########################
    ##   Add Contributor   ##
    #########################
    
    # will be done by http

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
        # Let other people in the group know that this person closed document detail page of this document
        Group('document_detail-'+str(document_id), channel_layer=message.channel_layer).send({"text":
                json.dumps({"header": "someone_close_document_detail", "accept": 'True', "body": {"id": message.user.id, "email": message.user.email}})})

    except (KeyError, Document.DoesNotExist):
        message.reply_channel.send({'accept': True})
