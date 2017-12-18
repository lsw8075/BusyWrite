import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EventBubbleService } from '../../services/event/event-bubble.service';
import { EventSangjunBoardService } from '../../services/event/event-sangjun-board.service';
import { BubbleService } from '../../services/bubble.service';
import { Bubble, SuggestBubble, BubbleType } from '../../models/bubble';
import { Comment } from '../../models/comment';

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
export class SangjunBoardComponent implements OnInit, OnDestroy {

    @Input() bubble: Bubble;
    @Input() bubbleList: Array<Bubble>;
    @Input() suggestBubbles: Array<SuggestBubble>;
    @Input() comments: Array<Comment>;
    @Input() selectedSB: SuggestBubble;

    isOBChecked = true;
    isSBChecked = true;
    isCommentChecked = true;
    isWatching = false;

    constructor(
        private _store: Store<fromDocument.State>,
        private _bubbleSerivice: BubbleService,
        private _eventBubbleService: EventBubbleService,
        private _eventSangjunBoardService: EventSangjunBoardService
    ) {
        this._store.select(fromDocument.isLoading).subscribe(loading => {

        });
    // _eventBubbleService.sangjunBoardOpenEvent$.subscribe((bubble) => {
    //   this.bubble = bubble;
    //   this.suggestBubbles = bubble.suggestBubbles;
    //   this.isOBChecked = true;
    //   this.isSBChecked = true;
    //   this.isCommentChecked = true;
    //   this.isWatching = false;
    //   this.selectedSB = null;
    //   _eventBubbleService.clearState();
    // });

    // _eventSangjunBoardService._backButtonClickEvent$.subscribe(() => {
    //   this.selectedSB = null;
    // });

    // _eventSangjunBoardService._switchClickEvent$.subscribe((suggestBubble) => {
    //   console.log('switch');
    // //  this.bubble = _bubbleSerivice.switchBubble(this.bubble, suggestBubble);
    //   this.suggestBubbles = this.bubble.suggestBubbles;
    //   this.suggestBubbles = this.suggestBubbles.sort((sb1, sb2) => sb2.thumbUps - sb1.thumbUps);
    //   this.selectedSB = null;
    // });

    // _eventSangjunBoardService._editClickEvent$.subscribe((suggestBubble) => {
    //   console.log('edit');
    // });

    // _eventSangjunBoardService._deleteClickEvent$.subscribe((suggestBubble) => {
    //   this.bubble.deleteSuggestBubble(suggestBubble);
    //   this.selectedSB = null;
    //   console.log('delete');
    // });

    // _eventSangjunBoardService._thumbsUpClickEvent$.subscribe((suggestBubble) => {
    //   suggestBubble.thumbUps++;
    //   this.suggestBubbles = this.suggestBubbles.sort((sb1, sb2) => sb2.thumbUps - sb1.thumbUps);
    // });
    }

    public createSuggestBubble() {
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
        this._eventSangjunBoardService.clickThumbsUp(suggestBubble);
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

    ngOnInit() {
    }

    ngOnDestroy() {
        // this._store.dispatch(new BubbleAction.SelectSangjunBoard(null));
    }

}
