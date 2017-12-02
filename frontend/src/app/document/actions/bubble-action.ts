import { Action } from '@ngrx/store';
import { Bubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';

export const OPEN = '[Document] open';
export const OPEN_COMPLETE = '[Document] open complete';
export const OPEN_ERROR = '[Document] open error';
export class Open implements Action {
  readonly type = OPEN;
  constructor(public payload: number) {}
}
export class OpenComplete implements Action {
  readonly type = OPEN_COMPLETE;
  constructor(public payload: number) {}
}
export class OpenError implements Action {
  readonly type = OPEN_ERROR;
  constructor(public payload: string) {}
}

export const LOAD = '[Bubble] Load';
export const LOAD_COMPLETE = '[Bubble] load Complete';
export const LOAD_ERROR = '[Bubble] load Error';
export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: number) {}
}
export class LoadComplete implements Action {
  readonly type = LOAD_COMPLETE;
  constructor(public payload: Array<Bubble>) {}
}
export class LoadError implements Action {
  readonly type = LOAD_ERROR;
  constructor(public payload: string) {}
}

export const SELECT = '[Bubble] Select';
export class Select implements Action {
  readonly type = SELECT;
  constructor(public payload: {
    bubble: Bubble,
    menu: MenuType}) {}
}

export const CREATE = '[Bubble] create';
export const CREATE_COMPLETE = '[Bubble] create Complete';
export const CREATE_ERROR = '[Bubble] create Error';
export class Create implements Action {
  readonly type = CREATE;
  constructor(public payload: {
    bubble: Bubble,
    menu: MenuType}) {}
}
export class CreateComplete implements Action {
  readonly type = CREATE_COMPLETE;
  constructor(public payload: {
    bubble: Bubble,
    menu: MenuType}) {}
}
export class CreateError implements Action {
  readonly type = CREATE_ERROR;
  constructor(public payload: string) {}
}

export const EDIT = '[Bubble] edit (check if can get edit lock)';
export const EDIT_UPDATE = '[Bubble] edit update';
export const EDIT_COMPLETE = '[Bubble] edit Complete';
export const EDIT_ERROR = '[Bubble] edit Error';
export class Edit implements Action {
  readonly type = EDIT;
  constructor(public payload: Bubble) {}
}
export class EditComplete implements Action {
  readonly type = EDIT_COMPLETE;
  constructor(public payload: Bubble) {}
}
export class EditError implements Action {
  readonly type = EDIT_ERROR;
  constructor(public payload: string) {}
}

export const WRAP = '[Bubble] wrap';
export const WRAP_COMPLETE = '[Bubble] wrap Complete';
export const WRAP_ERROR = '[Bubble] wrap Error';
export class Wrap implements Action {
  readonly type = WRAP;
  constructor(public payload: Array<Bubble>) {}
}
export class WrapComplete implements Action {
  readonly type = WRAP_COMPLETE;
  constructor(public payload: Array<Bubble>) {}
}
export class WrapError implements Action {
  readonly type = WRAP_ERROR;
  constructor(public payload: string) {}
}

export const POP = '[Bubble] pop';
export const POP_COMPLETE = '[Bubble] pop Complete';
export const POP_ERROR = '[Bubble] pop Error';
export class Pop implements Action {
  readonly type = POP;
  constructor(public payload: Bubble) {}
}
export class PopComplete implements Action {
  readonly type = POP_COMPLETE;
  constructor(public payload: Bubble) {}
}
export class PopError implements Action {
  readonly type = POP_ERROR;
  constructor(public payload: string) {}
}

export const MERGE = '[Bubble] merge';
export const MERGE_COMPLETE = '[Bubble] merge Complete';
export const MERGE_ERROR = '[Bubble] merge Error';
export class Merge implements Action {
  readonly type = MERGE;
  constructor(public payload: Bubble) {}
}
export class MergeComplete implements Action {
  readonly type = MERGE_COMPLETE;
  constructor(public payload: Bubble) {}
}
export class MergeError implements Action {
  readonly type = MERGE_ERROR;
  constructor(public payload: string) {}
}

export const SPLIT = '[Bubble] split';
export const SPLIT_COMPLETE = '[Bubble] split Complete';
export const SPLIT_ERROR = '[Bubble] split Error';
export class Split implements Action {
  readonly type = SPLIT;
  constructor(public payload: Bubble) {}
}
export class SplitComplete implements Action {
  readonly type = SPLIT_COMPLETE;
  constructor(public payload: Bubble) {}
}
export class SplitError implements Action {
  readonly type = SPLIT_ERROR;
  constructor(public payload: string) {}
}

export const DELETE = '[Bubble] delete';
export const DELETE_COMPLETE = '[Bubble] delete Complete';
export const DELETE_ERROR = '[Bubble] delete Error';
export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: Bubble) {}
}
export class DeleteComplete implements Action {
  readonly type = DELETE_COMPLETE;
  constructor(public payload: Bubble) {}
}
export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
  constructor(public payload: string) {}
}

export type Actions =
  | Open
  | OpenComplete
  | OpenError
  | Load
  | LoadComplete
  | LoadError
  | Select
  | Create
  | CreateComplete
  | CreateError
  | Edit
  | EditComplete
  | EditError
  | Wrap
  | WrapComplete
  | WrapError
  | Pop
  | PopComplete
  | PopError
  | Merge
  | MergeComplete
  | MergeError
  | Split
  | SplitComplete
  | SplitError
  | Delete
  | DeleteComplete
  | DeleteError;
