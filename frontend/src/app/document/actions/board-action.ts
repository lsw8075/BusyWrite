import { Action } from '@ngrx/store';
import { Board, BoardType } from '../models/board';

export const OPEN = '[Board] open';
export class Open implements Action {
    readonly type = OPEN;
    constructor(public payload: void) {}
}

export const ADD = '[Board] add';
export const DELETE = '[Board] delete';
export const DELETE_ALL = '[Board] delete all';
export const HIDE = '[Board] hide';
export const SHOW_LEFT = '[Board] show on left';
export const SHOW_RIGHT = '[Board] show on right';
export class Add implements Action {
    readonly type = ADD;
    constructor(public payload: BoardType) {}
}
export class Delete implements Action {
    readonly type = DELETE;
    constructor(public payload: Board) {}
}
export class DeleteAll implements Action {
    readonly type = DELETE_ALL;
    constructor() {}
}
export class Hide implements Action {
    readonly type = HIDE;
    constructor(public payload: Board) {}
}
export class ShowLeft implements Action {
    readonly type = SHOW_LEFT;
    constructor(public payload: Board) {}
}
export class ShowRight implements Action {
    readonly type = SHOW_RIGHT;
    constructor(public payload: Board) {}
}

export const CLEAR_ERROR = '[Board] clear error';
export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
    constructor(public payload ?: void) {}
}

export const SELECT = '[Board] select';
export class Select implements Action {
    readonly type = SELECT;
    constructor(public payload: Board) {}
}


export const SHOW_SANGJUN = '[Board] sangjun show';
export const SHOW_EDIT = '[Board] edit show';
export const SHOW_FILTER = '[Board] filter show';


export type Actions =
    | Open
    | Add
    | Delete
    | DeleteAll
    | Hide
    | ShowLeft
    | ShowRight
    | ClearError
    | Select;
