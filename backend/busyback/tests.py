from django.test import TestCase, Client
from channels import Channel, Group
from channels.tests import ChannelTestCase, Client, WSClient, HttpClient
from django.contrib.auth.models import User
from .consumers import ws_connect, ws_receive, ws_disconnect
from .models import *
from .errors import *
from django.utils import timezone
import json
import pdb

# Connection and disconnection should always succeed unless server is down 
class ChannelConnectTestCase(ChannelTestCase):
    def setUp(self):
        u1 = User.objects.create_user(username='swpp')
        u1.set_password('swpp')
        u1.save()
        self.client = WSClient()
        self.client.login(username='swpp', password='swpp')

    def test_wr_connect_disconnect(self):
        # connection
        message = {"text": {"header": "connect"}}
        
        self.client.send("websocket.connect", content=message)
        
        message = self.get_next_message("websocket.connect", require=True)
        ws_connect(message)
        
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['accept'], True)

        # disconnection
        message = {"text": {"header": "disconnect"}}

        self.client.send("websocket.disconnect", content=message)

        message = self.get_next_message("websocket.disconnect", require=True)
        ws_disconnect(message)

        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['accept'], True)

# Those can be doen before open_document
class ChannelReceiveTestCaseOne(ChannelTestCase):
    def setUp(self):
        d1 = Document.objects.create(title='A')
        b1 = NormalBubble.objects.create(location=0, document = d1)
        u1 = User.objects.create_user(username='swpp')
        u1.set_password('swpp')
        u1.save()
        d1.contributors.add(u1)
        d1.save()

        self.userid = u1.id
        self.fstid = d1.id
        
        d2 = Document.objects.create(title='B')
        b2 = NormalBubble.objects.create(location=0, document = d2)
        u2 = User.objects.create_user(username='gonssam')
        u2.set_password('gonssam')
        u2.save()
        d2.contributors.add(u2)
        d2.save()

        self.sndid = d2.id
 
        self.client = HttpClient()
        self.client.login(username='swpp', password='swpp')

        message = {"text": {"header": "connect"}}
        self.client.send_and_consume("websocket.connect", content=message)
        self.client.receive()

    # basic bailing
    def test_wr_receive_header_Key_Error(self):
        message = {"body":"wow"}
        self.client.send('websocket.receive', content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'response')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'header, body, previous_request needed')

    def test_wr_receive_header_empty_error(self):
        message = {"header":"", 'previous_request': 0, "body":{"document": str(self.fstid)}}
        self.client.send('websocket.receive', content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'response')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'empty command')
 
    def test_wr_receive_body_empty_error(self):
        message = {"header":"hey", 'previous_request': 0, "body":{}}
        self.client.send('websocket.receive', content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'hey')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'empty body')
 
    def test_attempt_close_document_before_open_document(self):
        message = {"header": "close_document", 'previous_request': 0, "body": {"document_id": str(self.fstid)}}
        self.client.send("websocket.receive", content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'close_document')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'request command without opening valid document')

    # open document
    def test_open_document_Key_Error(self):
        message = {'header': 'open_document', 'previous_request': 0, 'body':{'hey':'yey'}}
        self.client.send('websocket.receive', content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'open_document')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'document_id needed')

    def test_open_document_Document_Does_Not_Exist(self):
        message = {'header': 'open_document', 'previous_request': 0, 'body': {'document_id':0}}
        self.client.send('websocket.receive', content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'open_document')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'document does not exist')

    def test_open_document_Not_Contributed_By(self):
        message = {'header': 'open_document', 'previous_request': 0, 'body': {'document_id':str(self.sndid)}}
        self.client.send('websocket.receive', content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'open_document')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'user does not contribute to the document')

    def test_open_document_success(self):
        message = {'header': 'open_document', 'previous_request': 0, 'body': {'document_id':str(self.fstid)}}
        self.client.send('websocket.receive', content={'order':0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'open_document')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['document_id'], str(self.fstid))

        result = self.client.receive();
        self.assertEqual(result['header'], 'someone_open_document_detail')
        self.assertEqual(result['body']['id'], self.userid)

        Group("document_detail-"+str(self.fstid)).send({"body":"wow"})
        result = self.client.receive()
        self.assertEqual(result['body'], 'wow')

# Those done after open_document
# TODO: add synchro test, cross command safety test
class ChannelReceiveTestCaseTwo(ChannelTestCase):
    def setUp(self):
        d1 = Document.objects.create(title='A')
        b1 = NormalBubble.objects.create(location=0, document = d1)
        u1 = User.objects.create_user(username='swpp')
        u1.set_password('swpp')
        u1.save()
        d1.contributors.add(u1)
        d1.save()

        self.fstid = d1.id
        self.bubbleid = b1.id
        self.userid = u1.id

        d2 = Document.objects.create(title='B')
        b2 = NormalBubble.objects.create(location=0, document = d2)
        u2 = User.objects.create_user(username='gonssam')
        u2.set_password('gonssam')
        u2.save()
        d2.contributors.add(u2)
        d2.save()
    
        d1.contributors.add(u2)
        d1.save()

        self.client = HttpClient()
        self.client.login(username='swpp', password='swpp')

        message = {"header": "connect"}
        self.client.send_and_consume("websocket.connect", content=message)
        self.client.receive()

        message = {'header': 'open_document', 'previous_request': 0, 'body': {'document_id': str(d1.id)}}
        self.client.send('websocket.receive', content={'order': 0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.previous_request = result['body']['previous_request_id']
        self.client.receive()
 
    def test_wr_disconnect(self):
        self.client.send("websocket.disconnect", content={"body":""})
        message = self.get_next_message("websocket.disconnect", require=True)
        ws_disconnect(message)
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['accept'], True)   

        # Check out of group
        Group("document_detail-1").send({"body":"wow"})
        self.assertIsNone(self.client.receive())

    def test_wr_receive_invalid_command(self):
        message = {"header": "wow", 'previous_request': self.previous_request, "body":{"document":"1"}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'wow')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'invalid command')

    def test_close_document_attempt_closing_unopened_document(self):
        message = {'header': 'close_document', 'previous_request': self.previous_request, 'body': {'document_id':'2'}}
        self.client.send('websocket.receive', content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'close_document')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'attempt to close unopened document')

    def test_close_document_success(self):
        message = {'header': 'close_document', 'previous_request': self.previous_request, 'body': {'document_id':str(self.fstid)}}
        self.client.send('websocket.receive', content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'close_document')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['document_id'], str(self.fstid))

        # TODO: solve this problem: 
        #       each message has different reply_channel, so Group.discard is not testable
        # Check out of group
        #Group("document_detail-1").send({"body":"wow"})
        #self.assertIsNone(self.client.receive())

    def test_get_bubble_list_success(self):
        message = {'header': 'get_bubble_list', 'previous_request': self.previous_request, 'body':{'something':''}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], "get_bubble_list")

    def test_get_bubble_by_id_Bubble_Does_Not_Exist_Error(self):
        message = {'header': 'get_bubble_by_id', 'previous_request': self.previous_request, 'body': {'bubble_id': '0'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'get_bubble_by_id')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'bubble does not exist for the id')

    def test_get_bubble_by_id_success(self):
        message = {'header': 'get_bubble_by_id', 'previous_request': self.previous_request, 'body': {'bubble_id': str(self.bubbleid)}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'get_bubble_by_id')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['id'], self.bubbleid)
        self.assertEqual(result['body']['location'], 0)

# Bubble operations that have to be broadcasted
class ChannelBubbleOperationTestCase(ChannelTestCase):
    def setUp(self):
        d1 = Document.objects.create(title='A')
        b1 = NormalBubble.objects.create(location=0, document = d1)
        u1 = User.objects.create_user(username='swpp')
        u1.set_password('swpp')
        u1.save()
        d1.contributors.add(u1)
        d1.save()

        self.fstid = d1.id
        self.bubbleid = b1.id
        self.userid = u1.id

        d2 = Document.objects.create(title='B')
        b2 = NormalBubble.objects.create(location=0, document = d2)
        u2 = User.objects.create_user(username='gonssam')
        u2.set_password('gonssam')
        u2.save()
        d2.contributors.add(u2)
        d2.save()
    
        d1.contributors.add(u2)
        d1.save()

        self.client = HttpClient()
        self.client.login(username='swpp', password='swpp') 

        message = {"header": "connect"}
        self.client.send_and_consume("websocket.connect", content=message)
        self.client.receive()
        
        message = {'header': 'open_document', "previous_request": 0, 'body': {'document_id': str(d1.id)}}
        self.client.send('websocket.receive', content={'order': 0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.previous_request = result['body']['previous_request_id']
        self.client.receive()

        self.sndClient = HttpClient()
        self.sndClient.login(username='gonssam', password='gonssam')

        self.sndClient.send_and_consume("websocket.connect", content={"text": {"header": "connect"}})
        self.sndClient.receive()
        
        self.sndClient.send('websocket.receive', content={'order':0}, 
                text=str({"header": "open_document", "previous_request": 0, "body": {"document_id": str(self.fstid)}}))
        self.sndClient.consume('websocket.receive')
        self.sndClient.receive()
        self.sndClient.receive()
        result = self.client.receive()
        self.assertEqual(result['header'], 'someone_open_document_detail')

    def test_create_bubble_body_invalid_format(self):
        message = {'header': 'create_bubble', 'previous_request': self.previous_request, 'body': {'parent': str(self.bubbleid), 'location': '0'}}
        self.client.send('websocket.receive', content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'create_bubble')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'body does not follow format')
 
    def test_create_bubble_body_invalid_format(self):
        message = {'header': 'create_bubble', 'previous_request': self.previous_request,
            'body': {'parent_id': str(self.bubbleid), 'location': '1', 'content': 'wow'}}
        self.client.send('websocket.receive', content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'create_bubble')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'invalid location')
    
    def test_create_bubble_success(self):
        message = {'header': 'create_bubble', 'previous_request': self.previous_request,
            'body': {'parent_id': str(self.bubbleid), 'location': '0', 'content': 'wow'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'create_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['location'], 0)
        self.assertEqual(result['body']['content'], 'wow')
        
        self.assertIsNotNone(Bubble.objects.get(id=result['body']['id']))
        
        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'create_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['location'], 0)
        self.assertEqual(result['body']['content'], 'wow')

    def test_edit_bubble_success(self):
        # create bubble 
        message = {'header': 'create_bubble', 'previous_request': self.previous_request,
            'body': {'parent_id': self.bubbleid, 'location': '0', 'content': 'wow'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        new_bubble_id = result['body']['id']
        create_request_id = result['request_id']

        # finish editting bubble
        message = {'header': 'finish_editting_bubble', 'previous_request': create_request_id,
            'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':2}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()

        self.assertEqual(result['header'], 'finish_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        finish_request_id = result['request_id']

        # start editting bubble
        message = {'header': 'edit_bubble', 'previous_request': finish_request_id,
            'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'edit_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        
        start_edit_request_id = result['request_id']

        changed_bubble = NormalBubble.objects.get(id=new_bubble_id)
        this_user = User.objects.get(id=self.userid)
        self.assertEqual(changed_bubble.edit_lock_holder, this_user)

        self.sndClient.receive() #create
        self.sndClient.receive() #finishedit
        result = self.sndClient.receive() #edit
        self.assertEqual(result['header'], 'edit_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)

        # update editting bubble 
        message = {'header': 'update_content_of_editting_bubble', 'previous_request': start_edit_request_id,
            'body': {'bubble_id': new_bubble_id, 'content': 'hey i like you'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'update_content_of_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        self.assertEqual(result['body']['content'], 'hey i like you')
        
        update_editting_request_id = result['request_id']

        # Change is recorded at cache, not db!  
        #self.assertEqual(changed_bubble.content, 'hey i like you')

        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'update_content_of_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        self.assertEqual(result['body']['content'], 'hey i like you')

        # finish editting bubble
        message = {'header': 'finish_editting_bubble', 'previous_request': update_editting_request_id,
             'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'finish_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        
        changed_bubble = NormalBubble.objects.get(id=new_bubble_id)
        this_user = User.objects.get(id=self.userid)
        self.assertEqual(changed_bubble.edit_lock_holder, None)
        self.assertEqual(changed_bubble.content, 'hey i like you')

        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'finish_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)


    def test_discard_editting_bubble(self):
        # create bubble 
        message = {'header': 'create_bubble', 'previous_request': self.previous_request,
            'body': {'parent_id': self.bubbleid, 'location': '0', 'content': 'wow'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        new_bubble_id = result['body']['id']
        create_request_id = result['request_id']
        self.sndClient.receive()
        
        # finish editting bubble
        message = {'header': 'finish_editting_bubble', 'previous_request': create_request_id,
            'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':2}, text=str(message))
        self.client.consume('websocket.receive')

        result = self.client.receive()
        finish_request_id = result['request_id']
        self.sndClient.receive()
        
        # start editting bubble
        message = {'header': 'edit_bubble', 'previous_request': finish_request_id,
            'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        start_edit_request_id = result['request_id']
        self.sndClient.receive()

        # update editting bubble 
        message = {'header': 'update_content_of_editting_bubble', 'previous_request': start_edit_request_id,
            'body': {'bubble_id': new_bubble_id, 'content': 'hey i like you'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        update_editting_request_id = result['request_id']
        self.sndClient.receive()

        # discard editting bubble
        message = {'header': 'discard_editting_bubble', 'previous_request': update_editting_request_id,
             'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'discard_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        
        changed_bubble = NormalBubble.objects.get(id=new_bubble_id)
        this_user = User.objects.get(id=self.userid)
        self.assertEqual(changed_bubble.edit_lock_holder, None)
        self.assertEqual(changed_bubble.content, 'wow')

        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'discard_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)

        
    def test_discard_editting_newly_created_bubble(self):
        # create bubble 
        message = {'header': 'create_bubble', 'previous_request': self.previous_request,
            'body': {'parent_id': self.bubbleid, 'location': '0', 'content': 'wow'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        new_bubble_id = result['body']['id']
        create_request_id = result['request_id']
        self.sndClient.receive()

        # discard editting bubble
        message = {'header': 'discard_editting_bubble', 'previous_request': create_request_id,
             'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        print(result['body'])
        self.assertEqual(result['header'], 'discard_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        
        changed_bubble = NormalBubble.objects.get(id=new_bubble_id)
        self.assertIsNone(changed_bubble)

        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'discard_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)

    def test_delete_bubble_BubbleIsRootError(self):
        message = {'header': 'delete_bubble', 'previous_request': self.previous_request,
            'body': {'bubble_id': self.bubbleid}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'delete_bubble')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'root bubble cannot be deleted')

        self.assertIsNotNone(Bubble.objects.get(id=self.bubbleid))
       
    # TODO: def test_release_ownership_of_bubble(self):

    def test_finish_editting_split_move_delete_bubble_success(self):
        
        # create bubble 
        message = {'header': 'create_bubble', 'previous_request': self.previous_request,
            'body': {'parent_id': self.bubbleid, 'location': '0', 'content': 'wow'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        new_bubble_id = result['body']['id']
        create_request_id = result['request_id']

        # finish editting bubble
        message = {'header': 'finish_editting_bubble', 'previous_request': create_request_id,
            'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':2}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()

        self.assertEqual(result['header'], 'finish_editting_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        finish_request_id = result['request_id']

        # split bubble
        message = {'header': 'split_leaf_bubble', 'previous_request': finish_request_id,
            'body': {'bubble_id': new_bubble_id, 'split_content_list': ['w', 'ow']}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()

        self.assertEqual(result['header'], 'split_leaf_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)
        self.assertEqual(result['body']['split_content_list'], ['w', 'ow'])
        print(result['request_id'])
        print(result['body'])
        #self.assertEqual(result['body']['split_bubble_object_list'][0]['content'], 'w')
        #self.assertEqual(result['body']['split_bubble_object_list'][1]['content'], 'ow')
        new_new_bubble_id = result['body']['split_bubble_object_list'][0]['id']

        # move bubble that is being editted: it is acceptable!
        message = {'header': 'move_bubble', 'previous_request': self.previous_request,
            'body': {'bubble_id': new_new_bubble_id, 
            'new_parent_id': self.bubbleid, 'new_location': 1}}
        self.client.send("websocket.receive", content={'order':2}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()

        self.assertEqual(result['header'], 'move_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['bubble_id'], new_new_bubble_id)
        self.assertEqual(result['body']['new_parent_id'], self.bubbleid)

        # delete bubbble
        message = {'header': 'delete_bubble', 'previous_request': self.previous_request,
            'body': {'bubble_id': new_bubble_id}}
        self.client.send("websocket.receive", content={'order':3}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        
        self.assertEqual(result['header'], 'delete_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['bubble_id'], new_bubble_id)

        try:
            Bubble.objects.get(id=new_bubble_id)
        except Bubble.DoesNotExist:
            self.assertEqual(True, True)
            return
        self.assertEqual(True, False)

class ChannelSuggestBubbleTestCase(ChannelTestCase):
    def setUp(self):
        d1 = Document.objects.create(title='A')
        b1 = NormalBubble.objects.create(location=0, document = d1)
        u1 = User.objects.create_user(username='swpp')
        u1.set_password('swpp')
        u1.save()
        d1.contributors.add(u1)
        d1.save()

        self.fstid = d1.id
        self.bubbleid = b1.id
        self.userid = u1.id

        d2 = Document.objects.create(title='B')
        b2 = NormalBubble.objects.create(location=0, document = d2)
        u2 = User.objects.create_user(username='gonssam')
        u2.set_password('gonssam')
        u2.save()
        d2.contributors.add(u2)
        d2.save()
    
        d1.contributors.add(u2)
        d1.save()

        self.client = HttpClient()
        self.client.login(username='swpp', password='swpp') 

        message = {"header": "connect"}
        self.client.send_and_consume("websocket.connect", content=message)
        self.client.receive()
        
        message = {'header': 'open_document', "previous_request": 0, 'body': {'document_id': str(d1.id)}}
        self.client.send('websocket.receive', content={'order': 0}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.previous_request = result['body']['previous_request_id']
        self.client.receive()

        self.sndClient = HttpClient()
        self.sndClient.login(username='gonssam', password='gonssam')

        self.sndClient.send_and_consume("websocket.connect", content={"text": {"header": "connect"}})
        self.sndClient.receive()
        
        self.sndClient.send('websocket.receive', content={'order':0}, 
                text=str({"header": "open_document", "previous_request": 0, "body": {"document_id": str(self.fstid)}}))
        self.sndClient.consume('websocket.receive')
        self.sndClient.receive()
        self.sndClient.receive()
        result = self.client.receive()
        self.assertEqual(result['header'], 'someone_open_document_detail')

    def test_create_suggest_Bubble_Does_Not_Exist(self):
        message = {'header': 'create_suggest_bubble', 'previous_request': self.previous_request,
            'body': {'binded_bubble_id': 0, 'content': 'wow'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'create_suggest_bubble')
        self.assertEqual(result['accept'], 'False')
        self.assertEqual(result['body'], 'bubble does not exist for the id')

    def test_create_get_hide_show_suggest_bubble_success(self):
        
        # create suggest bubble
        message = {'header': 'create_suggest_bubble', 'previous_request': self.previous_request,
            'body': {'binded_bubble_id': self.bubbleid, 'content': 'wow'}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'create_suggest_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['normal_bubble'], self.bubbleid)

        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'create_suggest_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['normal_bubble'], self.bubbleid)

        sgbubbleid = result['body']['id']

        # get suggest bubble list
        message = {'header': 'get_suggest_bubble_list', 'previous_request': self.previous_request,
            'body': {'bubble_id': self.bubbleid}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'get_suggest_bubble_list')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(len(result['body']), 1)
        self.assertEqual(result['body'][0]['id'], sgbubbleid)
        self.assertIsNone(self.sndClient.receive())

        # get suggest bubble by id
        message = {'header': 'get_suggest_bubble_by_id', 'previous_request': self.previous_request,
            'body': {'suggest_bubble_id': sgbubbleid}}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'get_suggest_bubble_by_id')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['id'], sgbubbleid)
        self.assertIsNone(self.sndClient.receive())

        # hide suggest bubble
        message = {'header': 'hide_suggest_bubble', 'previous_request': self.previous_request,
            'body': {'suggest_bubble_id': sgbubbleid }}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'hide_suggest_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['suggest_bubble_id'], sgbubbleid)

        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'hide_suggest_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['suggest_bubble_id'], sgbubbleid)

        # Show suggest bubble
        message = {'header': 'show_suggest_bubble', 'previous_request': self.previous_request,
            'body': {'suggest_bubble_id': sgbubbleid }}
        self.client.send("websocket.receive", content={'order':1}, text=str(message))
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], 'show_suggest_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['suggest_bubble_id'], sgbubbleid)

        result = self.sndClient.receive()
        self.assertEqual(result['header'], 'show_suggest_bubble')
        self.assertEqual(result['accept'], 'True')
        self.assertEqual(result['body']['who'], self.userid)
        self.assertEqual(result['body']['suggest_bubble_id'], sgbubbleid)


