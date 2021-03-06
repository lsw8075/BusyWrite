import { Component, OnInit, Input } from '@angular/core';

import { Board, BoardType, BoardLocation } from '../../models/board';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../../user/reducers/reducer';
import * as fromDocument from '../../reducers/reducer';

import * as BoardAction from '../../actions/board-action';
import * as RouterAction from '../../../shared/route/route-action';

@Component({
  selector: 'app-board-manager',
  templateUrl: './board-manager.component.html',
  styleUrls: ['./board-manager.component.css']
})
export class BoardManagerComponent  {

    boardType = BoardType;
    boardLocation = BoardLocation;

    isCollapsed = true;

    boardList$: Observable<Board[]>;
    leftBoard$: Observable<Board>;
    rightBoard$: Observable<Board>;

    activeBoard: Board = null;

    constructor(private _store: Store<fromDocument.State>) {
        this.boardList$ = _store.select(fromDocument.getBoardList);
        this.leftBoard$ = _store.select(fromDocument.getLeftBoard);
        this.rightBoard$ = _store.select(fromDocument.getRightBoard);

        this._store.select(fromDocument.getActiveBoard).subscribe(board => {
            this.activeBoard = board;
        });
     }

    public addBoard(boardType: BoardType): void {
        this._store.dispatch(new BoardAction.Add(boardType));
    }

    public deleteBoard(board: Board): void {
        this._store.dispatch(new BoardAction.Delete(board));
    }

    public hideBoard(board: Board): void {
        this._store.dispatch(new BoardAction.Hide(board));
    }

    public showOnLeft(board: Board): void {
        this._store.dispatch(new BoardAction.ShowLeft(board));
    }

    public showOnRight(board: Board): void {
        this._store.dispatch(new BoardAction.ShowRight(board));
    }

    public deleteAll(): void {
        this._store.dispatch(new BoardAction.DeleteAll());
    }

    public getCardClassNameByBoard(board: Board): string {
        if (board) {
            if (this.isBoardActive(board)) {
                return 'border-danger';
            }
            switch (board.type) {
                case BoardType.view:
                    return 'border-primary';
                case BoardType.edit:
                    return 'border-secondary';
                case BoardType.filter:
                    return 'border-success';
                case BoardType.suggest:
                    return 'border-info';
            }
        } else {
            return '';
        }

    }

    boardToString(board: Board): string {
        if (board) {
            switch (board.type) {
                case BoardType.view:
                    return 'View';
                case BoardType.edit:
                    return 'Edit';
                case BoardType.filter:
                    return 'Search';
                case BoardType.suggest:
                    return 'Suggest';
            }
        } else {
            return 'No board';
        }

    }


    public isBoardActive(board: Board): boolean {
        if (this.activeBoard && board) {
            return this.activeBoard.id === board.id;
        }
        return false;
    }

    isImportantBoard(board: Board): boolean {
        return (board.location === BoardLocation.left ||
            board.location === BoardLocation.right);
    }

}
