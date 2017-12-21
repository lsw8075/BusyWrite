import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EventBubbleService } from '../../services/event/event-bubble.service';
import { BubbleService } from '../../services/bubble.service';
import { Bubble, SuggestBubble, BubbleType } from '../../models/bubble';
import { Comment } from '../../models/comment';
import { User } from '../../../user/models/user';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../../user/reducers/reducer';
import * as fromDocument from '../../reducers/reducer';

import * as BoardAction from '../../actions/board-action';
import * as BubbleAction from '../../actions/bubble-action';
import * as RouterAction from '../../../shared/route/route-action';

import { getContent } from '../../reducers/bubble-operation';

@Component({
  selector: 'app-sangjun-board',
  templateUrl: './sangjun-board.component.html',
  styleUrls: ['./sangjun-board.component.css', '../board-style.css']
})
export class SangjunBoardComponent {

    @Input() bubble: Bubble;
    @Input() bubbleList: Array<Bubble>;
    @Input() suggestBubbles: Array<SuggestBubble>;
    @Input() comments: Array<Comment>;
    @Input() selectedSB: SuggestBubble;
    @Input() contributers: Array<User>;
    @Input() userId: number;

    isOBChecked = true;
    isSBChecked = true;
    isCommentChecked = true;
    isWatching = false;

    constructor(
        private _store: Store<fromDocument.State>,
        private _bubbleSerivice: BubbleService,
        private _eventBubbleService: EventBubbleService) {}

    public createSuggestBubble() {
        this._store.dispatch(new BoardAction.ShowEdit());
        this._store.dispatch(new BubbleAction.CreateSuggestStart({
            bindBubbleId: this.bubble.id,
            isBindSuggest: false,
            content: this.getContentOfBubble(this.bubble)
        }));
    }
    public getSuggestBubbleList(): Array<SuggestBubble> {
        return this.suggestBubbles.filter(b => (! b.hidden) && (b.bindId === this.bubble.id));
    }

    public getContentOfBubble(bubble: Bubble) {
        return getContent(this.bubbleList, bubble.id);
    }

    clickSuggestBubble(suggestBubble: SuggestBubble) {
        this._store.dispatch(new BubbleAction.SelectSuggestBubble(suggestBubble));
    }

    clickSBThumbsUp(suggestBubble: SuggestBubble) {
        suggestBubble.thumbUps++;
    }

    clickBubbleThumbsUp() {
        this.bubble.thumbUps++;
    }

    clickWatch() {
        this.isWatching = true;
    }

    clickUnwatch() {
        this.isWatching = false;
    }

} /* istanbul ignore next */
