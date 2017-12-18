from django.test import TestCase
from .models import *
from .mock_db_setup import *
from .errors import *
from .notes import *

class NotesTestCase(TestCase):

    def setUp(self):
        mockDBSetup(self)

    def test_note(self):
        note = do_fetch_notes(self.user1.id, self.doc1.id)
        self.assertEqual(note[0]['content'], 'Test note1')

        note = do_fetch_note(self.user1.id, self.doc1.id, self.note1.id)
        self.assertEqual(note['content'], 'Test note1')

        new_note = do_create_note(self.user1.id, self.doc1.id, 'new_note')

        self.assertEqual(note['content'], 'new_note')

        do_edit_note(self.user1.id, self.doc1.id, self.note1.id, 'edit note')

        self.note1 = Note.objects.get(id=self.note1.id)

        self.assertEqual(note['content'], 'edit note')

        do_delete_note(self.user1.id, self.doc1.id, self.note1.id)
        with self.assertRaises(NoteDoesNotExistError):
            do_fetch_note(self.user1.id, self.doc1.id, self.note1.id)

    def test_do_export_note(self):
        do_export_note_to_normal(0, self.user1.id, self.doc1.id, self.bubble2.id, 0, self.note1.id)
        do_export_note_to_suggest(0, self.user1.id, self.doc1.id, self.bubble2.id, self.note1.id)
        do_export_note_to_comment_under_normal(0, self.user1.id, self.doc1.id, self.bubble1.id, self.note1.id)
        do_export_note_to_comment_under_suggest(0, self.user1.id, self.doc1.id, self.suggest1.id, self.note1.id)
