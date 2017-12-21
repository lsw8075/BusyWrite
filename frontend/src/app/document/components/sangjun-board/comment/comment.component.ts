import { Component, OnInit, Input } from '@angular/core';

import { CommentService } from '../../service';

import { Bubble, SuggestBubble, BubbleType } from '../../../models/bubble';
import { Comment } from '../../../models/comment';
import { User } from '../../../../user/models/user';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../../reducers/reducer';
import * as BoardAction from '../../../actions/board-action';
import * as BubbleAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() bubble: Bubble;
  @Input() bubbleList: Array<Bubble>;
  @Input() suggestBubbles: Array<SuggestBubble>;
  @Input() comments: Array<Comment>;
  @Input() selectedSB: SuggestBubble;

  @Input() contributers: Array<User>;
  @Input() userId: number;

    editContent: string;
    editComment: Comment;
    newComment: Comment;

    constructor(
        private _store: Store<fromDocument.State>) {
        this.editComment = null;
    }

    ngOnInit() {
        this.newComment = new Comment(-1, "", this.userId, this.bubble.id, this.getBubbleComments(this.bubble).length);
    }

    getBubbleComments(bubble: Bubble): Array<Comment> {
        const bubbleComments = this.comments.filter(comment => comment.bubbleId === bubble.id);
        bubbleComments.sort((c1, c2) => c1.order - c2.order);
        return bubbleComments;
    }

    getUsername(id: number): string {
        return this.contributers.filter(user => user.id === id)[0].username;
    }

    clickStartEditComment(comment: Comment) {
        this.editContent = comment.content;
        this.editComment = comment;
    }

    clickCompleteEditComment(comment: Comment) {
        console.log('edit comment');

//        this._store.dispatch(new BubbleAction.EditCommentOnBubble({commentId: comment.id, content: this.editContent}))
        comment.content = this.editContent;
        this.editComment = null;
    }


    clickDeleteComment(bubble: any, comment: Comment) {
    //    bubble.deleteComment(comment);
    }

    clickCreateComment(bubble: any) {

    }

}
