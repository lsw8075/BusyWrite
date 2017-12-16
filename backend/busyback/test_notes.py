from django.test import TestCase
from .models import *
from .mock_db_setup import *
from .errors import *
from .notes import *

class NotesTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_do_export_note(self):
        do_export_note_to_normal(0, self.user1.id, self.doc1.id, self.bubble2.id, 0, self.note1.id)
        do_export_note_to_suggest(0, self.user1.id, self.doc1.id, self.bubble2.id, self.note1.id)
        do_export_note_to_comment_under_normal(0, self.user1.id, self.doc1.id, self.bubble1.id, self.note1.id)
        do_export_note_to_comment_under_suggest(0, self.user1.id, self.doc1.id, self.suggest1.id, self.note1.id)
