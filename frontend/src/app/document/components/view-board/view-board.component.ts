import { Component, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { MenuType, ActionType, Board, BubbleTemp } from './service';
import { BubbleService } from './service';

import { PreviewComponent } from './preview/preview.component';
import { BoardService } from '../../services/board.service';
import { EventBubbleService } from '../../services/event/event-bubble.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../../user/reducers/reducer';

import * as fromDocument from '../../reducers/reducer';
import * as BubbleAction from '../../actions/bubble-action';
import * as RouterAction from '../../../shared/route/route-action';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../../models/bubble';

import { BubbleJsonHelper } from '../../models/bubble-json-helper';

@Component({
    selector: 'app-view-board',
    templateUrl: './view-board.component.html',
    styleUrls: ['./view-board.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ViewBoardComponent implements OnInit {

    rootBubble$: Observable<Bubble>;
    bubbleList$: Observable<Array<Bubble>>;

  constructor(
    private _store: Store<fromDocument.State>,
    private _boardService: BoardService,
    private _bubbleService: BubbleService,
    private _eventBubbleService: EventBubbleService) {
        let cnt = 0;
        this.rootBubble$ = _store.select(fromDocument.getBubbleState).map(bubbleState => bubbleState.rootBubble);
        this.bubbleList$ = _store.select(fromDocument.getBubbleList);

        this._store.select(fromDocument.getBubbleState).subscribe((res) => {
            console.log(cnt++);
            for (const bubble of res.bubbleList) {
                if (bubble.type === BubbleType.internalBubble) {
                    const internalBubble = bubble as InternalBubble;
                    const msg = {
                        id: internalBubble.id,
                        parentBubbleId: internalBubble.parentBubbleId,
                        childBubbleIds: internalBubble.childBubbleIds,
                        location: internalBubble.location};
                    console.log(msg);
                } else if (bubble.type === BubbleType.leafBubble) {
                    const leafBubble = bubble as LeafBubble;
                    const msg = {
                        id: leafBubble.id,
                        content: leafBubble.content.substr(0, 10),
                        parentBubbleId: leafBubble.parentBubbleId,
                        location: leafBubble.location};
                    console.log(msg);
                }
            }
            console.log(res.bubbleList);

        });

        // this._store.select(fromUser.getUserId).subscribe((res) => {
        //     console.log('[user id]', res);
        // });
    }

    ngOnInit() {
        this._store.dispatch(new BubbleAction.Open(1));
    }

  previewClick(event) {
      if (event.index === 1) {
  //      this._boardService.updatePreview();
      }
  }

  // public onShowBubbleMenuEvent() {

  // }

  // public onShowBorderMenuEvent() {

  // }

  // public onOpenSangjunBoardEvent() {

  // }

} /* istanbul ignore next */
