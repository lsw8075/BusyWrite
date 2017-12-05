import { Action } from '@ngrx/store';
import { Board, BoardType } from '../models/board';

export const OPEN = '[Board] open';
export class Open implements Action {
    readonly type = OPEN;
    constructor(public payload: void) {}
}


export type Actions =
    | Open;
