import { Action } from '@ngrx/store';

export const ACCEPT = '[invitation] accept';
export const ACCEPT_FAIL = '[invitation] fail';

export class Accept implements Action {
    readonly type = ACCEPT;
    constructor() {}
}


export type Actions =
    | Accept;
