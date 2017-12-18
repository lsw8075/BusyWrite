import { Component, OnInit, Input } from '@angular/core';
import { EventSangjunBoardService } from '../../../services/event/event-sangjun-board.service';

import { Bubble, SuggestBubble, BubbleType } from '../../../models/bubble';
import { Comment } from '../../../models/comment';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../../reducers/reducer';
import * as BoardAction from '../../../actions/board-action';
import * as BubbleAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';

@Component({
  selector: 'app-suggest-bubble',
  templateUrl: './suggest-bubble.component.html',
  styleUrls: ['./suggest-bubble.component.css']
})

export class SuggestBubbleComponent implements OnInit {

  @Input() bubble: Bubble;
  @Input() bubbleList: Array<Bubble>;
  @Input() suggestBubbles: Array<SuggestBubble>;
  @Input() comments: Array<Comment>;
  @Input() selectedSB: SuggestBubble;

  constructor(
      private _store: Store<fromDocument.State>,
      private _eventSangjunBoardService: EventSangjunBoardService) { }

    ngOnInit() {
    }

    clickBackButton() {
        this._store.dispatch(new BubbleAction.SelectSuggestBubbleClear(null));
    }

    clickSwitch() {
        this._store.dispatch(new BubbleAction.SwitchBubble(this.selectedSB.id));
    }

    clickEdit() {
    }

    clickDelete() {
        this._store.dispatch(new BubbleAction.HideSuggest(this.selectedSB.id));

    }

    clickThumbsUp() {
    }

}
