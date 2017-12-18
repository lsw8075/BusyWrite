import { Component, OnInit, Input } from '@angular/core';

import { CommentService } from '../../service';

import { Bubble, SuggestBubble, BubbleType } from '../../../models/bubble';
import { Comment } from '../../../models/comment';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

    @Input() bubble: Bubble;
    @Input() suggestBubble: SuggestBubble;
    @Input() comments: Comment[];

    editContent: string;
    editId: number;

    constructor() {
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

    }

}
