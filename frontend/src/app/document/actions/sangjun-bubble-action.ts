import { Action } from '@ngrx/store';
import { Bubble, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';

export const OPEN = '[SANGJUN BOARD] open';
export class Open implements Action {
    readonly type = OPEN;
    constructor(public payload: Bubble) {}
}

export const LOAD = '[sangjun board] load';
export class Load implements Action {
    readonly type = LOAD;
    constructor() {}
}

export type Actions =
    | Open
    | Load;
