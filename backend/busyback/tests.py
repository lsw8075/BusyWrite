from django.test import TestCase, Client
from channels import Channel, Group
from channels.tests import ChannelTestCase, Client
from django.contrib.auth.models import User
from .consumers import ws_connect, ws_receive, ws_disconnect
from .models import Document
import json

class ChannelConnectTestCase(ChannelTestCase):
    def setUp(self):
        d = Document.objects.create(title='A')

    def test_wr_connect(self):
        message = {"path": "document_detail/1"}
        
        client = Client()
        client.send("websocket.connect", content=message)
        
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
        self.assertEqual(result['message'], "wrong path")

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
        message = {"path": "document_detail/1"}
        self.client = Client()
        self.client.send("websocket.connect", content=message)
        message = self.get_next_message("websocket.connect", require=True)
        ws_connect(message)
        self.get_next_message(message.reply_channel.name, require=True)
    
    def test_wr_receive(self):
        message = {'text': 'wow'}
        self.client.send("websocket.receive", content=message)
        message = self.get_next_message("websocket.receive", require=True)
        ws_receive(message)
#import pdb; pdb.set_trace()
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['text'], 'wow')    

    def test_wr_disconnect(self):
        self.client.send("websocket.disconnect", content={"text":""})
        message = self.get_next_message("websocket.disconnect", require=True)
        ws_disconnect(message)
        result = self.get_next_message(message.reply_channel.name, require=True)
        self.assertEqual(result['disconnected'], True)
