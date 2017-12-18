import { Component, OnInit, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { DocumentService } from './service';
import { BubbleService } from '../services/bubble.service';
import { ServerSocket } from '../services/websocket.service';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

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
import * as UserAction from '../../user/actions/user-action';

import { ViewBoardMenuType } from '../reducers/bubble-reducer';

import { MatSnackBar } from '@angular/material';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-document-detail-page',
  templateUrl: './document-detail-page.component.html',
  styleUrls: ['./document-detail-page.component.css'],
  providers: [ ServerSocket, BubbleService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DocumentDetailPageComponent implements OnInit {

    boardType = BoardType;
    viewBoardMenuType = ViewBoardMenuType;

    leftBoard$: Observable<Board>;
    rightBoard$: Observable<Board>;

    activeBoard: Board = null;


    rootBubble$: Observable<InternalBubble>;
    bubbleList$: Observable<Array<Bubble>>;
    userId$: Observable<Number>;
    selectedBubbleList$: Observable<Bubble[]>;
    hoverBubbleList$: Observable<Bubble[]>;
    selectedMenu$: Observable<MenuType>;

    sangjunBubble$: Observable<Bubble>;

    viewBoardMenu$: Observable<ViewBoardMenuType>;

    documentTitle = 'empty title';
    changeTitle = false;

    addContributerModalRef: BsModalRef;

    constructor(
        private _documentService: DocumentService,
        private _store: Store<fromDocument.State>,
        public _snackBar: MatSnackBar,
        private _modalService: BsModalService
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

        this.viewBoardMenu$ = this._store.select(fromDocument.getViewBoardMenuState);

        this._store.select(fromDocument.getBoardStateError).subscribe(err => {
            if (err) {
                this.showErrorMsg(err);
                this._store.dispatch(new BoardAction.ClearError());
            }
        });

        this._store.select(fromDocument.getBubbleStateError).subscribe(err => {
            if (err) {
                this.showErrorMsg(err);
                this._store.dispatch(new BubbleAction.ClearError());
            }
        });

        this._store.select(fromDocument.getBubbleStateMsg).subscribe(msg => {
            if (msg) {
                this.showSuccessMsg(msg);
                this._store.dispatch(new BubbleAction.ClearMsg());
            }
        });
    }

    ngOnInit() {
        this._store.dispatch(new BubbleAction.Open());
    }

    public titleEditDone() {
        this.changeTitle = false;
    }

    public titleEditStart() {
        this.changeTitle = true;
    }

    public wrapBubbles(): void {
        this._store.dispatch(new BubbleAction.WrapBubble());
    }

    public moveBubble(): void {
        this._store.dispatch(new BubbleAction.MoveBubble({bubbleId: 2, destBubbleId: 1, isAbove: true}));
    }

    public mergeBubble(): void {
        this._store.dispatch(new BubbleAction.MergeBubble());
    }

    public goBack(): void {
        this._store.dispatch(new RouterAction.GoByUrl(`/files`));
    }

    public signOut(): void {
        console.log('signout');
        this._store.dispatch(new UserAction.SignOut());
    }

    public addContributeropenModal(template: TemplateRef<any>) {
        this.addContributerModalRef = this._modalService.show(template);
    }

    public addContributer(f: NgForm) {
        const username = f.value.username;
        this._store.dispatch(new BubbleAction.AddContributerRequest(username));
    }

    public createNote(): void {

    }

    public isBoardActive(board: Board): boolean {
        if (this.activeBoard && board) {
            return this.activeBoard.id === board.id;
        }
        return false;
    }

    showErrorMsg(err: string): void {
        this._snackBar.open('Error!' , err, {
            duration: 2000
        });
    }
    showSuccessMsg(msg: string): void {
        this._snackBar.open('Hey!', msg, {
            duration: 2000
        });
    }

} /* istanbul ignore next */
