from django.test import TestCase
from .models import *
from .mock_db_setup import *
from .errors import *
from .comments import *

class CommentsTestCase(TestCase):
    
    def setUp(self):
        mockDBSetup(self)

    def test_do_fetch_comment(self):
        # under normal
        with self.assertRaises(UserIsNotContributorError):
            do_fetch_comment_under_normal(self.user1.id, self.doc2.id, self.comment4.id)
        with self.assertRaises(CommentDoesNotExistError):
            do_fetch_comment_under_normal(self.user1.id, self.doc1.id, 100)

        with self.assertRaises(DocumentMismatchError):
            do_fetch_comment_under_normal(self.user2.id, self.doc2.id, self.comment1.id)

        comment = do_fetch_comment_under_normal(self.user1.id, self.doc1.id, self.comment1.id)
        self.assertEqual(comment['content'], 'Com1')

        # under suggest
        with self.assertRaises(UserIsNotContributorError):
            do_fetch_comment_under_suggest(self.user1.id, self.doc2.id, self.comment5.id)
        with self.assertRaises(CommentDoesNotExistError):
            do_fetch_comment_under_suggest(self.user1.id, self.doc1.id, 100)

        with self.assertRaises(DocumentMismatchError):
            do_fetch_comment_under_suggest(self.user2.id, self.doc2.id, self.comment3.id)

        comment = do_fetch_comment_under_suggest(self.user1.id, self.doc1.id, self.comment3.id)
        self.assertEqual(comment['content'], 'Com3')

    def test_do_fetch_comments(self):
        # under normal
        with self.assertRaises(UserIsNotContributorError):
            do_fetch_comments_under_normal(self.user1.id, self.doc2.id, self.doc2root.id)

        with self.assertRaises(DocumentMismatchError):
            do_fetch_comments_under_normal(self.user2.id, self.doc1.id, self.doc2root.id)

        comments = do_fetch_comments_under_normal(self.user1.id, self.doc1.id, self.bubble1.id)

        self.assertEqual(comments[0]['id'], self.comment1.id)
        # under suggest
        with self.assertRaises(UserIsNotContributorError):
            do_fetch_comments_under_suggest(self.user1.id, self.doc2.id, self.suggest4.id)

        with self.assertRaises(DocumentMismatchError):
            do_fetch_comments_under_suggest(self.user2.id, self.doc1.id, self.suggest4.id)

        comments = do_fetch_comments_under_suggest(self.user1.id, self.doc1.id, self.suggest1.id)

        self.assertEqual(comments[0]['id'], self.comment3.id)
    '''
    def test_do_create_comment(self):
        # under normal
        with self.assertRaises(UserIsNotContributorError):
            do_create_comment_under_normal(self.user1.id, self.doc2.id, self.doc2root.id, '')

        with self.assertRaises(DocumentMismatchError):
            do_create_comment_under_normal(self.user2.id, self.doc1.id, self.doc2root.id, '')

        with self.assertRaises(ContentEmptyError):
            do_create_comment_under_normal(self.user1.id, self.doc1.id, self.bubble1.id, '')

        do_create_comment_under_normal(self.user1.id, self.doc1.id, self.bubble1.id, 'TestCom')
        do_create_comment_under_normal(self.user1.id, self.doc1.id, self.bubble1.id, 'TestCom')
        comment = do_create_comment_under_normal(self.user1.id, self.doc1.id, self.bubble1.id, 'TestCom')
        reload_bubbles(self, [1])
        self.assertEqual(comment['content'], 'TestCom')
        self.assertEqual(self.bubble1.next_comment_order, 5)
        # under suggest
        with self.assertRaises(UserIsNotContributorError):
            do_create_comment_under_suggest(self.user1.id, self.doc2.id, self.suggest4.id, '')

        with self.assertRaises(DocumentMismatchError):
            do_create_comment_under_suggest(self.user2.id, self.doc1.id, self.suggest4.id, '')

        with self.assertRaises(ContentEmptyError):
            do_create_comment_under_suggest(self.user1.id, self.doc1.id, self.suggest1.id, '')

        do_create_comment_under_suggest(self.user1.id, self.doc1.id, self.suggest1.id, 'TestCom')
        do_create_comment_under_suggest(self.user1.id, self.doc1.id, self.suggest1.id, 'TestCom')
        comment = do_create_comment_under_suggest(self.user1.id, self.doc1.id, self.suggest1.id, 'TestCom')
        reload_suggests(self, [1])
        self.assertEqual(comment['content'], 'TestCom')
        self.assertEqual(self.suggest1.next_comment_order, 4)
    '''
    def test_do_edit_comment_under_normal(self):
        # under normal
        with self.assertRaises(UserIsNotCommentOwnerError):
            do_edit_comment_under_normal(self.user2.id, self.doc1.id, self.comment1.id, '')

        with self.assertRaises(ContentEmptyError):
            do_edit_comment_under_normal(self.user1.id, self.doc1.id, self.comment1.id, '')

        comment = do_edit_comment_under_normal(self.user1.id, self.doc1.id, self.comment1.id, 'Test Edit')

        self.assertEqual(comment['content'], 'Test Edit')
        # under suggest
        with self.assertRaises(UserIsNotCommentOwnerError):
            do_edit_comment_under_suggest(self.user2.id, self.doc1.id, self.comment3.id, '')

        with self.assertRaises(ContentEmptyError):
            do_edit_comment_under_suggest(self.user1.id, self.doc1.id, self.comment3.id, '')

        comment = do_edit_comment_under_suggest(self.user1.id, self.doc1.id, self.comment3.id, 'Test Edit')

        self.assertEqual(comment['content'], 'Test Edit')

    def test_do_delete_comment_under_normal(self):
        # under normal
        with self.assertRaises(UserIsNotCommentOwnerError):
            do_delete_comment_under_normal(self.user2.id, self.doc1.id, self.comment1.id)

        do_delete_comment_under_normal(self.user1.id, self.doc1.id, self.comment1.id)
        # under suggest
        with self.assertRaises(UserIsNotCommentOwnerError):
            do_delete_comment_under_suggest(self.user2.id, self.doc1.id, self.comment3.id)

        do_delete_comment_under_suggest(self.user1.id, self.doc1.id, self.comment3.id)
