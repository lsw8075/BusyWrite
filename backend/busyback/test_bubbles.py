from django.test import TestCase
from .models import *
from .mock_db_setup import *
from .errors import *
from .bubbles import *
from .debug import *

class BubblesTestCase(TestCase):
    
    def setUp(self):
        mockDBSetup(self)

    def test_process_bubble(self):
        #print(process_normal(self.bubble2))
        #print(process_normal(self.bubble4))
        #print(process_suggest(self.suggest1))
        pass

    def test_do_fetch_bubble(self):

        with self.assertRaises(BubbleDoesNotExistError):
            do_fetch_normal_bubble(0, self.user1.id, self.doc1.id, 100)

        with self.assertRaises(BubbleDoesNotExistError):
            do_fetch_suggest_bubble(0, self.user1.id, self.doc1.id, 100)
        self.assertEqual(do_fetch_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble4.id)['content'], 'TestLeaf1')
        self.assertEqual(do_fetch_suggest_bubble(0, self.user1.id, self.doc1.id, self.suggest2.id)['content'], 'TestSuggest2')

    def test_do_fetch_bubbles(self):
        emptydoc = Document.objects.create(title='error doc')
        emptydoc.contributors.add(self.user1)
        emptydoc.save()
        
        with self.assertRaises(InternalError):
            do_fetch_normal_bubbles(0, self.user1.id, emptydoc.id)

        with self.assertRaises(UserIsNotContributorError):
            do_fetch_normal_bubbles(0, self.user1.id, self.doc2.id)

        with self.assertRaises(BubbleDoesNotExistError):
            do_fetch_suggest_bubbles(0, self.user1.id, self.doc1.id, 100)

        bubbles = do_fetch_normal_bubbles(0, self.user1.id, self.doc1.id)
        suggests = do_fetch_suggest_bubbles(0, self.user1.id, self.doc1.id, self.bubble1.id)
        self.assertEqual(len(bubbles), 7)
        self.assertEqual(len(suggests), 2)

        suggests = do_fetch_suggest_bubbles(0, self.user1.id, self.doc1.id, self.bubble4.id)
        self.assertEqual(len(suggests), 0)

    def test_get_root_bubble(self):
        emptydoc = Document.objects.create(title='error doc')
        emptydoc.contributors.add(self.user1)

        with self.assertRaises(InternalError):
            do_get_root_bubble(0, self.user1.id, emptydoc.id)
        
        multi1 = create_normal(emptydoc)
        multi2 = create_normal(emptydoc)

        with self.assertRaises(InternalError):
            do_get_root_bubble(0, self.user1.id, emptydoc.id)

        self.assertEqual(do_get_root_bubble(0, self.user1.id, self.doc1.id)['id'], self.doc1root.id)

    def test_do_create_normal_bubble(self):

        with self.assertRaises(InvalidLocationError):
            do_create_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, 100, True, 'test content')
        
        self.bubble3.lock(self.user2)


        do_create_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, 1, False, 'test content')
        new_bubble = fetch_normal(do_create_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, 2, True, 'test content')[1]['id'])

        self.assertEqual(self.bubble2.fetch_child(2).id, new_bubble.id)

    def test_updating_normal_bubble(self):
        new_bubble = fetch_normal(do_create_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, 2, True, 'test content')[1]['id'])

        do_updating_normal_bubble(0, self.user1.id, self.doc1.id, new_bubble.id, 'hello world')

        do_update_finish_normal_bubble(0, self.user1.id, self.doc1.id, new_bubble.id)

        new_bubble = NormalBubble.objects.get(id=new_bubble.id)

        self.assertEqual(new_bubble.content, 'hello world')

        do_edit_normal_bubble(0, self.user1.id, self.doc1.id, new_bubble.id, 'bye world')

        do_updating_normal_bubble(0, self.user1.id, self.doc1.id, new_bubble.id, 'hello world')
        do_update_discard_normal_bubble(0, self.user1.id, self.doc1.id, new_bubble.id)

        new_bubble = NormalBubble.objects.get(id=new_bubble.id)

        self.assertEqual(new_bubble.content, 'bye world')

    def test_do_create_suggest_bubble(self):
        new_suggest = do_create_suggest_bubble(0, self.user1.id, self.doc1.id, self.bubble4.id, 'new suggest')[1]
        
    def test_do_edit_normal_bubble(self):

        with self.assertRaises(BubbleIsInternalError):
            do_edit_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, 'asdf')

        self.bubble4.lock(self.user3)
        with self.assertRaises(BubbleLockedError):
            do_edit_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble4.id, 'edit fail due to lock')

        
        self.bubble4.unlock(self.user3)
        do_edit_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble4.id, 'sample edit')

        reload_bubbles(self, [4])
        self.assertEqual(self.bubble4.content, 'sample edit')

    def test_do_move_normal_bubble(self):

        with self.assertRaises(BubbleIsLeafError):
            do_move_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble1.id, self.bubble4.id, 0)
        
        with self.assertRaises(BubbleIsRootError):
            do_move_normal_bubble(0, self.user1.id, self.doc1.id, self.doc1root.id, self.doc1root.id, 0)

        with self.assertRaises(NotInSameDocumentError):
            do_move_normal_bubble(0, self.user2.id, self.doc1.id, self.bubble5.id, self.doc2root.id, 0)

        self.bubble2.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_move_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble4.id, self.doc1root.id, 0)

        with self.assertRaises(BubbleLockedError):
            do_move_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble3.id, self.bubble2.id, 0)

        self.bubble2.unlock(self.user2)

        do_move_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble1.id, self.bubble2.id, 2)

    def test_do_unlock_bubble(self):
        self.bubble3.lock(self.user2)
        do_unlock_bubble(0, self.user2.id, self.doc1.id, self.bubble3.id)

    def test_hide_and_show_suggest(self):
        do_hide_suggest_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        reload_suggests(self, [1])
        self.assertTrue(self.suggest1.hidden)
        do_show_suggest_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        reload_suggests(self, [1])
        self.assertFalse(self.suggest1.hidden)

    def test_do_delete_normal_bubble(self):
        with self.assertRaises(BubbleIsRootError):
            do_delete_normal_bubble(0, self.user1.id, self.doc1.id, self.doc1root.id)

        self.bubble4.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_delete_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble4.id)

        self.bubble4.unlock(self.user2)
        
        do_delete_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id)

    def test_do_wrap_normal_bubble(self):
        with self.assertRaises(InvalidWrapError):
            do_wrap_normal_bubble(0, self.user1.id, self.doc1.id, [])

        with self.assertRaises(InvalidWrapError):
            do_wrap_normal_bubble(0, self.user1.id, self.doc1.id, [self.bubble4.id, self.bubble6.id])

        wrapper = do_wrap_normal_bubble(0, self.user1.id, self.doc1.id, [self.bubble4.id, self.bubble5.id])

       
    def test_do_pop_normal_bubble(self):
        with self.assertRaises(BubbleIsRootError):
            do_pop_normal_bubble(0, self.user1.id, self.doc1.id, self.doc1root.id)

        self.bubble4.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_pop_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id)
        
        with self.assertRaises(BubbleIsLeafError):
            do_pop_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble3.id)

        self.bubble4.unlock(self.user2)
        do_pop_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id)

      
    def test_do_flatten_normal_bubble(self):

        self.bubble2.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_flatten_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id)
        
        self.bubble2.unlock(self.user2)
        do_flatten_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id)


    def test_do_split_leaf_bubble(self):

        with self.assertRaises(BubbleIsInternalError):
            do_split_leaf_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, ['1234', '5678'])

        with self.assertRaises(InvalidSplitError):
            do_split_leaf_bubble(0, self.user3.id, self.doc1.id, self.bubble3.id, [])

        self.bubble4.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_split_leaf_bubble(0, self.user1.id, self.doc1.id, self.bubble4.id, ['Test', 'Bubble1'])


        do_split_leaf_bubble(0, self.user1.id, self.doc1.id, self.bubble3.id, ['Test', 'Bubble2'])

    def test_do_split_internal_bubble(self):

        with self.assertRaises(BubbleIsLeafError):
            do_split_internal_bubble(0, self.user1.id, self.doc1.id, self.bubble3.id, [1,2])

        with self.assertRaises(InvalidSplitError):
            do_split_internal_bubble(0, self.user3.id, self.doc1.id, self.bubble2.id, [])

        self.bubble2.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_split_internal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, [1])

        self.bubble2.unlock(self.user2)

        with self.assertRaises(InvalidSplitError):
            do_split_internal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, [1, 2, 7])

        do_split_internal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, [1])

    def test_do_vote_bubble(self):
        do_vote_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        self.assertTrue(self.suggest1.is_voted_by(self.user1))
        do_unvote_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        self.assertFalse(self.suggest1.is_voted_by(self.user1))

    def test_do_switch_bubble(self):

        self.bubble1.lock(self.user2)
        with self.assertRaises(BubbleLockedError):
            do_switch_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        self.bubble1.unlock(self.user2)


        do_vote_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        do_vote_bubble(0, self.user2.id, self.doc1.id, self.suggest1.id)

        do_switch_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        
        # reload it
        reload_bubbles(self, [1])
        reload_suggests(self, [1])
        self.assertEqual(self.bubble1.content, 'TestSuggest1')
        self.assertEqual(self.suggest1.content, 'TestBubble1')


        do_vote_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        do_vote_bubble(0, self.user3.id, self.doc1.id, self.suggest1.id)
        do_switch_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)
        reload_bubbles(self, [1])
        reload_suggests(self, [1])

        do_switch_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id)

        reload_bubbles(self, [1])
        reload_suggests(self, [1])

        do_switch_bubble(0, self.user1.id, self.doc1.id, self.suggest2.id)
  
        # reload it
        reload_bubbles(self, [2])
        reload_suggests(self, [2])
        self.assertEqual(self.bubble2.content, 'TestSuggest2')

    def test_do_merge_normal_bubble(self):
        merged = do_merge_normal_bubble(0, self.user1.id, self.doc1.id, [self.bubble4.id, self.bubble5.id])

    def test_do_release_ownership(self):
        new_bubble_id = do_create_normal_bubble(0, self.user1.id, self.doc1.id, self.bubble2.id, 1, True, 'test content')[1]['id']
        do_release_ownership(0, self.user1.id, self.doc1.id, new_bubble_id)

    def test_do_edit_suggest_bubble(self):
        do_edit_suggest_bubble(0, self.user1.id, self.doc1.id, self.suggest1.id, 'Fork')
