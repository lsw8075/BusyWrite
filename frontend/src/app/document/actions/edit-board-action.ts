import { Action } from '@ngrx/store';
import { Bubble, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';

export const OPEN = '[Edit Board] open';
export class Open implements Action {
    readonly type = OPEN;
    constructor(public payload: Bubble) {}
}

export type Actions =
    | Open;
