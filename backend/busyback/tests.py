from django.test import TestCase, Client
from channels import Channel, Group
from channels.tests import ChannelTestCase, Client, WSClient, HttpClient
from django.contrib.auth.models import User
from .consumers import ws_connect, ws_receive, ws_disconnect
from .models import *
from .errors import *
import json
import pdb

class ChannelConnectTestCase(ChannelTestCase):
    def setUp(self):
#pdb.set_trace()
        d = Document.objects.create(title='A')
        u = User.objects.create_user(username='swpp')
        u.set_password('swpp')
        u.save()
        d.contributors.add(u)
        d.save()
        
        self.client = WSClient()
        self.client.login(username='swpp', password='swpp')

    def test_wr_connect(self):
        message = {"path": "document_detail/1"}
        
        self.client.send("websocket.connect", content=message)
        
        message = self.get_next_message("websocket.connect", require=True)
        ws_connect(message)
        
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['accept'], True)
        
        Group("document_detail-1").send({"text": "wow"})
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['text'], 'wow')

    def test_wr_connect_value_error(self):
        message = {"path": "document_detail"}
        
        client = Client()
        client.send("websocket.connect", content=message)
        
        message = self.get_next_message("websocket.connect", require=True)
        ws_connect(message)
        
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['accept'], False)
        self.assertEqual(result['message'], "invalid path")

    def test_wr_connect_does_not_exist(self):
        message = {"path": "document_detail/3"}

        client = Client()
        client.send("websocket.connect", content=message)
        
        message = self.get_next_message("websocket.connect", require=True)
        ws_connect(message)
        
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['accept'], False)
        self.assertEqual(result['message'], "document does not exist")
        
class ChannelTestCase(ChannelTestCase):
    def setUp(self):
        d = Document.objects.create(title='A')
        u = User.objects.create_user(username='swpp')
        u.set_password('swpp')
        u.save()
        d.contributors.add(u)
        d.save()
 
#self.client = WSClient()
        self.client = HttpClient()
        self.client.login(username='swpp', password='swpp')

        message = {"path": "document_detail/1"}
        self.client.send_and_consume("websocket.connect", content=message)
#message = self.get_next_message("websocket.connect", require=True)
#ws_connect(message)
#self.get_next_message(message.reply_channel.name, require=True)
        self.client.receive()
    
    def test_wr_receive_fail(self):
        message = {'order':0, 'header': 'wow'}
        self.client.send("websocket.receive", content=message)
#message = self.get_next_message("websocket.receive", require=True)
#ws_receive(message)
#result = self.get_next_message(message.reply_channel.name, require=True)
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['accept'], False)

    def test_wr_receive_get_bubble_list(self):
        message = {'order':0, 'header': 'get_bubble_list'}
        self.client.send("websocket.receive", content=message)
#message = self.get_next_message("websocket.receive", require=True)
#ws_receive(message)
#result = self.get_next_message(message.reply_channel.name, require=True)
        self.client.consume('websocket.receive')
        result = self.client.receive()
        self.assertEqual(result['header'], "get_bubble_list")

    def test_wr_disconnect(self):
        self.client.send("websocket.disconnect", content={"text":""})
        message = self.get_next_message("websocket.disconnect", require=True)
        ws_disconnect(message)
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['disconnected'], True)
