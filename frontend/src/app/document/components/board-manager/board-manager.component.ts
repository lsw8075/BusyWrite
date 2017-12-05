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
export class BoardManagerComponent implements OnInit {

    boardType = BoardType;
    boardLocation = BoardLocation;

    isCollapsed = true;

    boardList$: Observable<Board[]>;

    constructor(private _store: Store<fromDocument.State>) {
        this.boardList$ = _store.select(fromDocument.getBoardList);
     }

    ngOnInit() {}

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

    icon(board: Board): string {
        if (board.location === BoardLocation.left) {
            return 'L';
        } else if (board.location === BoardLocation.right) {
            return 'R';
        }
        switch (board.type) {
            case BoardType.view:
                return 'V';
            case BoardType.edit:
                return 'E';
            case BoardType.filter:
                return 'F';
            case BoardType.suggest:
                return 'S';
        }
    }

    isImportantBoard(board: Board): boolean {
        return (board.location === BoardLocation.left ||
            board.location === BoardLocation.right);
    }

}
