import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { DocumentService } from './service';
import { BubbleService } from '../services/bubble.service';
import { ServerSocket } from '../services/websocket.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../models/bubble';
import { Board, BoardType, BoardLocation } from '../models/board';
import { User } from '../../user/models/user';
import { MenuType } from './service';

import * as fromUser from '../../user/reducers/reducer';
import * as fromDocument from '../reducers/reducer';

import * as BoardAction from '../actions/board-action';
import * as BubbleAction from '../actions/bubble-action';
import * as RouterAction from '../../shared/route/route-action';

@Component({
  selector: 'app-document-detail-page',
  templateUrl: './document-detail-page.component.html',
  styleUrls: ['./document-detail-page.component.css'],
  providers: [ ServerSocket, BubbleService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DocumentDetailPageComponent implements OnInit {

    boardType = BoardType;

    rootBubble$: Observable<InternalBubble>;
    bubbleList$: Observable<Array<Bubble>>;
    userId$: Observable<Number>;
    selectedBubbleList$: Observable<Bubble[]>;
    hoverBubbleList$: Observable<Bubble[]>;
    selectedMenu$: Observable<MenuType>;

    leftBoard$: Observable<Board>;
    rightBoard$: Observable<Board>;

    sangjunBubble$: Observable<Bubble>;

    activeBoard: Board = null;

    documentTitle = 'empty title';
    changeTitle = false;

    alerts: any = [];

    constructor(
        private _documentService: DocumentService,
        private _store: Store<fromDocument.State>
    ) {
        this.rootBubble$ = _store.select(fromDocument.getRootBubble);
        this.bubbleList$ = _store.select(fromDocument.getBubbleList);
        this.userId$ = this._store.select(fromUser.getUserId);
        this.selectedBubbleList$ = this._store.select(fromDocument.getSelectedBubbleList);
        this.hoverBubbleList$ = this._store.select(fromDocument.getHoverBubbleList);
        this.selectedMenu$ = this._store.select(fromDocument.getSelectedMenu);

        this.leftBoard$ = this._store.select(fromDocument.getLeftBoard);
        this.rightBoard$ = this._store.select(fromDocument.getRightBoard);

        this.sangjunBubble$ = this._store.select(fromDocument.getSangjunBubble);

        this._store.select(fromDocument.getActiveBoard).subscribe(board => {
            this.activeBoard = board;
        });

        this._store.select(fromDocument.getBoardStateError).subscribe(err => {
            if (err) {
                this.addError(err);
                this._store.dispatch(new BoardAction.ClearError());
            }
        });

        this._store.select(fromDocument.getBubbleStateError).subscribe(err => {
            if (err) {
                this.addError(err);
                this._store.dispatch(new BubbleAction.ClearError());
            }
        });
    }

    ngOnInit() {
        this._store.dispatch(new BubbleAction.Open(1));
    }

    public titleEditDone() {
        this.changeTitle = false;
    }

    public titleEditStart() {
        this.changeTitle = true;
    }

    public isBoardActive(board: Board): boolean {
        if (this.activeBoard) {
            return this.activeBoard.id === board.id;
        }
        return false;
    }

    addError(err: string): void {
        this.alerts.push({
            type: 'warning',
            msg: err,
            timeout: 2500
        });
    }

} /* istanbul ignore next */
