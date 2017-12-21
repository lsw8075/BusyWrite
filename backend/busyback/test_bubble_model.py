from django.test import TestCase
from .models import *
from .mock_db_setup import mockDBSetup
from .errors import *
from .utils import create_normal, create_suggest
from .debug import print_bubble_tree

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


    def test_splice_children(self):

        # set test environment
        troot = create_normal(self.doc1, '', self.doc1root, 3)
        tinternal1 = create_normal(self.doc1, '', troot, 0)
        tinternal2 = create_normal(self.doc1, '', troot, 1)
        tinternal3 = create_normal(self.doc1, '', troot, 2)
        tleafnew = []
        tleaf1 = []
        tleaf2 = []
        tleaf3 = []
        for i in range(0, 6):
            tleafnew.append(create_normal(self.doc1, 'Leaf Appended ' + str(i)))
            tleaf1.append(create_normal(self.doc1, 'Leaf 1-' + str(i), tinternal1, i))
            tleaf2.append(create_normal(self.doc1, 'Leaf 2-' + str(i), tinternal2, i))
            tleaf3.append(create_normal(self.doc1, 'Leaf 3-' + str(i), tinternal3, i))
        

        # do splice
        tinternal1.splice_children(2, 3, tinternal2, 3, tleafnew)
        # result may be
        # internal1: 10 11 A0 A1 A2 A3 A4 A5 15
        # internal2: 20 21 22 12 13 14 23 24 25


        # check internal 1
        self.assertEqual(tinternal1.fetch_child(1).id, tleaf1[1].id)
        self.assertEqual(tinternal1.fetch_child(2).id, tleafnew[0].id)
        self.assertEqual(tinternal1.fetch_child(7).id, tleafnew[5].id)
        self.assertEqual(tinternal1.fetch_child(8).id, tleaf1[5].id)
        # check internal 2
        self.assertEqual(tinternal2.fetch_child(2).id, tleaf2[2].id)
        self.assertEqual(tinternal2.fetch_child(3).id, tleaf1[2].id)
        self.assertEqual(tinternal2.fetch_child(5).id, tleaf1[4].id)
        self.assertEqual(tinternal2.fetch_child(6).id, tleaf2[3].id)

        # do splice in same bubble(for 'move' purpose)
        tinternal3.splice_children(3, 2, tinternal3, 1, [])

        def f(internal3, leaf3, order):
            for i in range(0, len(order)):
                self.assertEqual(internal3.fetch_child(i).id, tleaf3[order[i]].id)
        f(tinternal3, tleaf3, [0, 3, 4, 1, 2, 5])
        
        # revert move
        tinternal3.splice_children(1, 2, tinternal3, 3, [])

        f(tinternal3, tleaf3, [0, 1, 2, 3, 4, 5])


        
