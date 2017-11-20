from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *

class BubbleModelTestCase(TestCase):
    
    def setUp(self):
        mockDBSetup(self)

    def test_touch(self):
        '''
        from time import sleep
        # test cascaded touch
        old_timestamp2 = str(self.bubble2.timestamp)
        old_timestamp4 = str(self.bubble4.timestamp)
        sleep(0.1)
        self.bubble4.touch()
        new_timestamp2 = str(self.bubble2.timestamp)
        new_timestamp4 = str(self.bubble4.timestamp)
        self.assertNotEqual(old_timestamp2, new_timestamp2)
        self.assertNotEqual(old_timestamp4, new_timestamp4)
        print(old_timestamp4)
        print(new_timestamp4)
        # does not work correctly because of caching?
        '''
        pass

    def test_has_locked_directs(self):
        # always false for suggest bubbles
        self.assertFalse(self.suggest1.has_locked_directs())

        #

    def test_bubble_change_content(self):
        # unlocked
        self.bubble3.change_content('asdf')
        self.assertEqual(self.bubble3.content, 'asdf')

        # raise on locked
        self.bubble3.lock(self.user1)
        with self.assertRaises(BubbleLockedError):
            self.bubble3.change_content('asdf')

    def test_child_count(self):
        self.assertEqual(self.bubble2.child_count(), 3)
    
    def test_is_leaf(self):
        self.assertTrue(self.bubble4.is_leaf())

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

        
