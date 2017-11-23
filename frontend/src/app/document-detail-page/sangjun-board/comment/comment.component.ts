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
    this.newComment = new Comment(9, "", null);
  }

  ngOnInit() {
  }

}
