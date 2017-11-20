from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .bubbles import *

class BubblesTestCase(TestCase):
    
    def setUp(self):
        mockDBSetup(self)

    def test_check_contributor(self):
        with self.assertRaises(UserIsNotContributorError):
            check_contributor(self.bubble1, self.user3.id)
        
        with self.assertRaises(UserIsNotContributorError):
            check_contributor(self.suggest1, self.user3.id)

    def test_do_fetch_bubble(self):
        self.assertEqual(do_fetch_normal_bubble(4).id, 4)
        self.assertEqual(do_fetch_suggest_bubble(10).id, 10)

        with self.assertRaises(BubbleDoesNotExistError):
            do_fetch_normal_bubble(100)

        with self.assertRaises(BubbleDoesNotExistError):
            do_fetch_suggest_bubble(100)

#def test_do_fetch_bubbles(self):
#do_fetch_bubbles(1)
    def test_get_root_bubble(self):
        get_root_bubble(1)

    def test_do_create_normal_bubble(self):
        do_create_normal_bubble(self.user1.id, self.bubble2.id, 1, False, 'test content')
        do_create_normal_bubble(self.user1.id, self.bubble2.id, 1, True, 'test content')

        with self.assertRaises(InvalidLocationError):
            do_create_normal_bubble(self.user1.id, self.bubble2.id, 100, True, 'test content')


    def test_do_create_suggest_bubble(self):
         do_create_suggest_bubble(self.user1.id, self.bubble4.id, 'new suggest')

    def test_do_edit_normal_bubble(self):
        do_edit_normal_bubble(self.user1.id, self.bubble4.id, 'sample edit')

        self.bubble4.lock(self.user3)
        with self.assertRaises(BubbleLockedError):
            do_edit_normal_bubble(self.user1.id, self.bubble4.id, 'edit fail due to lock')
        
        owned = do_create_normal_bubble(self.user2.id, self.bubble2.id, 2, True, 'test owned')

        owned.unlock(self.user2)

        with self.assertRaises(BubbleOwnedError):
            do_edit_normal_bubble(self.user1.id, owned.id, 'edit fail due to ownership')
        
    def test_do_move_normal_bubble(self):

        do_move_normal_bubble(self.user1.id, self.bubble1.id, self.bubble2.id, 2)
        
        with self.assertRaises(BubbleIsRootError):
            do_move_normal_bubble(self.user1.id, self.doc1root.id, self.doc1root.id, 0)

        with self.assertRaises(NotInSameDocumentError):
            do_move_normal_bubble(self.user1.id, self.bubble5.id, self.doc2root.id, 0)

        self.bubble2.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_move_normal_bubble(self.user1.id, self.bubble4.id, self.doc1root.id, 0)

        with self.assertRaises(BubbleLockedError):
            do_move_normal_bubble(self.user1.id, self.bubble3.id, self.bubble2.id, 0)

        owned = do_create_normal_bubble(self.user2.id, self.bubble2.id, 2, True, 'test owned')

        self.bubble2.unlock(self.user2)
        owned.unlock(self.user2)
        with self.assertRaises(BubbleOwnedError):
            do_move_normal_bubble(self.user1.id, owned.id, self.doc1root.id, 0)

        with self.assertRaises(BubbleOwnedError):
            do_move_normal_bubble(self.user1.id, self.bubble3.id, owned.id, 0)


    def test_hide_and_show_suggest(self):
        do_hide_suggest_bubble(self.user1.id, self.suggest1.id)
        do_show_suggest_bubble(self.user1.id, self.suggest1.id)
    

    def test_do_delete_normal_bubble(self):
        with self.assertRaises(BubbleIsRootError):
            do_delete_normal_bubble(self.user1.id, self.doc1root.id)

        self.bubble4.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_delete_normal_bubble(self.user1.id, self.bubble4.id)
        owned = do_create_normal_bubble(self.user2.id, self.doc1root.id, 2, True, 'test owned')
        owned.unlock(self.user2)

        with self.assertRaises(BubbleOwnedError):
            do_delete_normal_bubble(self.user1.id, owned.id)

        self.bubble4.unlock(self.user2)
        do_delete_normal_bubble(self.user1.id, self.bubble2.id)



    def test_do_wrap_normal_bubble(self):
        with self.assertRaises(InvalidWrapError):
            do_wrap_normal_bubble(self.user1.id, [])

        with self.assertRaises(InvalidWrapError):
            do_wrap_normal_bubble(self.user1.id, [self.bubble2.id, self.bubble5.id])

        with self.assertRaises(InvalidWrapError):
            do_wrap_normal_bubble(self.user1.id, [self.bubble4.id, self.bubble6.id])

        do_wrap_normal_bubble(self.user1.id, [self.bubble4.id, self.bubble5.id])


    def test_do_pop_normal_bubble(self):
        with self.assertRaises(BubbleIsRootError):
            do_pop_normal_bubble(self.user1.id, self.doc1root.id)

        self.bubble4.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_pop_normal_bubble(self.user1.id, self.bubble2.id)
        
        with self.assertRaises(BubbleIsLeafError):
            do_pop_normal_bubble(self.user1.id, self.bubble3.id)

        self.bubble4.unlock(self.user2)
        do_pop_normal_bubble(self.user1.id, self.bubble2.id)

    def test_do_flatten_normal_bubble(self):

        self.bubble2.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_flatten_normal_bubble(self.user1.id, self.bubble2.id)
        
        with self.assertRaises(BubbleIsLeafError):
            do_flatten_normal_bubble(self.user1.id, self.bubble3.id)
        self.bubble2.unlock(self.user2)
        do_flatten_normal_bubble(self.user1.id, self.bubble2.id)






