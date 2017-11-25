import { Component, OnInit, Input } from '@angular/core';
import { SuggestBubble, Bubble, Comment } from '../../service';
import { CommentService } from '../../service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() bubble: Bubble;
  @Input() suggestBubble: SuggestBubble;

  newComment: Comment;
  editContent: string;
  editId: number;

  constructor(private _commentService: CommentService) {
    this.newComment = new Comment(_commentService.getCommentId(), "", null);
    this.editId = -1;
  }

  ngOnInit() {
  }

  clickStartEditComment(comment: Comment) {
    this.editContent = comment.content;
    this.editId = comment.id;
  }

  clickCompleteEditComment(comment: Comment) {
    console.log('edit comment');
    comment.content = this.editContent;
    this.editId = -1;
  }


  clickDeleteComment(bubble: any, comment: Comment) {
    bubble.deleteComment(comment);
  }

  clickCreateComment(bubble: any) {
    bubble.addComment(this.newComment);
    this.newComment = new Comment(this._commentService.getCommentId(), "", null);
  }

}
