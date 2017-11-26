import { Component, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { MenuType, ActionType, Board, Bubble } from './service';
import { BubbleService } from './service';

import { PreviewComponent } from './preview/preview.component';
import { BoardService } from '../../services/board.service';
import { EventBubbleService } from '../../services/event/event-bubble.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { State } from '../../index';
import * as BubbleAction from '../../actions/bubble.action';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css'],

})

export class ViewBoardComponent implements OnInit {

  rootBubble$: Observable<Bubble>;

  constructor(
      private _store: Store<State>,
      private _boardService: BoardService,
      private _bubbleService: BubbleService,
      private _eventBubbleService: EventBubbleService) {
        this.rootBubble$ = _store.select('bubble').map(bubble => bubble.rootBubble);
        this._store.select('bubble').subscribe((bubble) => {
          console.log(bubble);
        });
  }

  ngOnInit() {
    this._store.dispatch(new BubbleAction.Load(null));
  }

  previewClick(event) {
      if (event.index === 1) {
        this._boardService.updatePreview();
      }
  }

  // public onShowBubbleMenuEvent() {

  // }

  // public onShowBorderMenuEvent() {

  // }

  // public onOpenSangjunBoardEvent() {

  // }

} /* istanbul ignore next */

