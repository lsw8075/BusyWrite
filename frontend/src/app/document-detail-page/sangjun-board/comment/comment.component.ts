import { Component, OnInit, Input } from '@angular/core';
import { SuggestBubble, Bubble, Comment } from '../../service'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() bubble: Bubble;
  @Input() suggestBubble: SuggestBubble;

  newComment: Comment;

  constructor() {
    this.newComment = new Comment(-1, "", null);
  }

  ngOnInit() {
  }

  clickEditComment(comment: Comment) {
    console.log('edit comment');
  }

  clickDeleteComment(comment: Comment) {
    this.bubble.deleteComment(comment);
    console.log('delete comment');
  }

  clickCreateComment() {
    console.log('create comment');
    this.bubble.addComment(this.newComment);
    this.newComment = new Comment(-1, "", null);
  }

}
