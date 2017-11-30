from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .bubbles import create_normal

class BubbleModelTestCase(TestCase):
    
    def setUp(self):
        mockDBSetup(self)

    def test_bubble_change_content(self):
        self.bubble3.change_content('asdf')
        self.assertEqual(self.bubble3.content, 'asdf')

    def test_child_count(self):
        self.assertEqual(self.bubble2.child_count(), 3)
    
    def test_is_leaf(self):
        self.assertTrue(self.bubble4.is_leaf())

    def test_vote(self):
        self.bubble4.vote(self.user1);
        self.assertTrue(self.bubble4.is_voted_by(self.user1))
        self.assertFalse(self.bubble4.is_voted_by(self.user2))
        self.bubble4.unvote(self.user1);
        self.assertFalse(self.bubble4.is_voted_by(self.user1))        

    def test_bubble_lock(self):
        # lock bubble 2
        self.bubble2.lock(self.user1)

        self.assertTrue(self.doc1root.has_locked_descendants())
        self.assertTrue(self.bubble4.has_locked_ancestors())

        # cannot lock child of locked one
        with self.assertRaises(BubbleLockedError):
            self.bubble4.lock(self.user2)

        # cannot unlock by another user
        with self.assertRaises(BubbleLockedError):
            self.bubble2.unlock(self.user3)

        # unlock bubble 2
        self.bubble2.unlock(self.user1)
        # doubly unlock bubble 2
        self.bubble2.unlock(self.user1)

        self.assertFalse(self.bubble5.has_locked_directs())

    def test_fetch_child(self):
        # get child 1 of child 1 of doc1root
        self.assertEqual(self.doc1root.fetch_child(1).fetch_child(1).id, self.bubble5.id)

        # with invalid location
        with self.assertRaises(InvalidLocationError):
            self.doc1root.fetch_child(100)
