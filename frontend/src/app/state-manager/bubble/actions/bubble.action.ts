import { Action } from '@ngrx/store';
import { Bubble, MenuType } from '../index';

export const LOAD = '[Bubble] Load';
export const LOAD_COMPLETE = '[Bubble] load Complete';
export const LOAD_ERROR = '[Bubble] load Error';

export const SELECT = '[Bubble] Select';

export const CREATE = '[Bubble] create';
export const CREATE_COMPLETE = '[Bubble] create Complete';
export const CREATE_ERROR = '[Bubble] create Error';

export const EDIT = '[Bubble] edit';
export const EDIT_COMPLETE = '[Bubble] edit Complete';
export const EDIT_ERROR = '[Bubble] edit Error';

export const WRAP = '[Bubble] wrap';
export const WRAP_COMPLETE = '[Bubble] wrap Complete';
export const WRAP_ERROR = '[Bubble] wrap Error';

export const POP = '[Bubble] pop';
export const POP_COMPLETE = '[Bubble] pop Complete';
export const POP_ERROR = '[Bubble] pop Error';

export const MERGE = '[Bubble] merge';
export const MERGE_COMPLETE = '[Bubble] merge Complete';
export const MERGE_ERROR = '[Bubble] merge Error';

export const SPLIT = '[Bubble] split';
export const SPLIT_COMPLETE = '[Bubble] split Complete';
export const SPLIT_ERROR = '[Bubble] split Error';

export const DELETE = '[Bubble] delete';
export const DELETE_COMPLETE = '[Bubble] delete Complete';
export const DELETE_ERROR = '[Bubble] delete Error';

export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: void) {}
}

export class LoadComplete implements Action {
  readonly type = LOAD_COMPLETE;
  constructor(public payload: Bubble) {}
}

export class LoadError implements Action {
  readonly type = LOAD_ERROR;
  constructor(public payload: string) {}
}

export class Select implements Action {
  readonly type = SELECT;
  constructor(public payload: {
    bubble: Bubble,
    menu: MenuType}) {}
}

export class Pop implements Action {
  readonly type = POP;
  constructor(public payload: Bubble) {}
}

export class PopComplete implements Action {
  readonly type = POP_COMPLETE;
  constructor(public payload: void) {}
}

export class PopError implements Action {
  readonly type = POP_ERROR;
  constructor(public payload: string) {}
}

export type Actions =
  | Load
  | LoadComplete
  | LoadError
  | Pop
  | PopComplete
  | PopError
  | Select;
