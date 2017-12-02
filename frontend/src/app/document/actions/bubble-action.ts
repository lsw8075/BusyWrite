import { Action } from '@ngrx/store';
import { BubbleTemp } from '../models/bubble-temp';
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

export const LOAD = '[BubbleTemp] Load';
export const LOAD_COMPLETE = '[BubbleTemp] load Complete';
export const LOAD_ERROR = '[BubbleTemp] load Error';
export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: number) {}
}
export class LoadComplete implements Action {
  readonly type = LOAD_COMPLETE;
  constructor(public payload: Array<BubbleTemp>) {}
}
export class LoadError implements Action {
  readonly type = LOAD_ERROR;
  constructor(public payload: string) {}
}

export const SELECT = '[BubbleTemp] Select';
export class Select implements Action {
  readonly type = SELECT;
  constructor(public payload: {
    bubble: BubbleTemp,
    menu: MenuType}) {}
}

export const CREATE = '[BubbleTemp] create';
export const CREATE_COMPLETE = '[BubbleTemp] create Complete';
export const CREATE_ERROR = '[BubbleTemp] create Error';
export class Create implements Action {
  readonly type = CREATE;
  constructor(public payload: {
    bubble: BubbleTemp,
    menu: MenuType}) {}
}
export class CreateComplete implements Action {
  readonly type = CREATE_COMPLETE;
  constructor(public payload: {
    bubble: BubbleTemp,
    menu: MenuType}) {}
}
export class CreateError implements Action {
  readonly type = CREATE_ERROR;
  constructor(public payload: string) {}
}

export const EDIT = '[BubbleTemp] edit (check if can get edit lock)';
export const EDIT_UPDATE = '[BubbleTemp] edit update';
export const EDIT_COMPLETE = '[BubbleTemp] edit Complete';
export const EDIT_ERROR = '[BubbleTemp] edit Error';
export class Edit implements Action {
  readonly type = EDIT;
  constructor(public payload: BubbleTemp) {}
}
export class EditComplete implements Action {
  readonly type = EDIT_COMPLETE;
  constructor(public payload: BubbleTemp) {}
}
export class EditError implements Action {
  readonly type = EDIT_ERROR;
  constructor(public payload: string) {}
}

export const WRAP = '[BubbleTemp] wrap';
export const WRAP_COMPLETE = '[BubbleTemp] wrap Complete';
export const WRAP_ERROR = '[BubbleTemp] wrap Error';
export class Wrap implements Action {
  readonly type = WRAP;
  constructor(public payload: Array<BubbleTemp>) {}
}
export class WrapComplete implements Action {
  readonly type = WRAP_COMPLETE;
  constructor(public payload: Array<BubbleTemp>) {}
}
export class WrapError implements Action {
  readonly type = WRAP_ERROR;
  constructor(public payload: string) {}
}

export const POP = '[BubbleTemp] pop';
export const POP_COMPLETE = '[BubbleTemp] pop Complete';
export const POP_ERROR = '[BubbleTemp] pop Error';
export class Pop implements Action {
  readonly type = POP;
  constructor(public payload: BubbleTemp) {}
}
export class PopComplete implements Action {
  readonly type = POP_COMPLETE;
  constructor(public payload: BubbleTemp) {}
}
export class PopError implements Action {
  readonly type = POP_ERROR;
  constructor(public payload: string) {}
}

export const MERGE = '[BubbleTemp] merge';
export const MERGE_COMPLETE = '[BubbleTemp] merge Complete';
export const MERGE_ERROR = '[BubbleTemp] merge Error';
export class Merge implements Action {
  readonly type = MERGE;
  constructor(public payload: BubbleTemp) {}
}
export class MergeComplete implements Action {
  readonly type = MERGE_COMPLETE;
  constructor(public payload: BubbleTemp) {}
}
export class MergeError implements Action {
  readonly type = MERGE_ERROR;
  constructor(public payload: string) {}
}

export const SPLIT = '[BubbleTemp] split';
export const SPLIT_COMPLETE = '[BubbleTemp] split Complete';
export const SPLIT_ERROR = '[BubbleTemp] split Error';
export class Split implements Action {
  readonly type = SPLIT;
  constructor(public payload: BubbleTemp) {}
}
export class SplitComplete implements Action {
  readonly type = SPLIT_COMPLETE;
  constructor(public payload: BubbleTemp) {}
}
export class SplitError implements Action {
  readonly type = SPLIT_ERROR;
  constructor(public payload: string) {}
}

export const DELETE = '[BubbleTemp] delete';
export const DELETE_COMPLETE = '[BubbleTemp] delete Complete';
export const DELETE_ERROR = '[BubbleTemp] delete Error';
export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: BubbleTemp) {}
}
export class DeleteComplete implements Action {
  readonly type = DELETE_COMPLETE;
  constructor(public payload: BubbleTemp) {}
}
export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
  constructor(public payload: string) {}
}

export const OTHERS_CREATE = '[BubbleTemp] others create';
export const OTHERS_EDIT = '[BubbleTemp] others edit';
export const OTHERS_WRAP = '[BubbleTemp] others wrap';
export const OTHERS_POP = '[BubbleTemp] others pop';
export const OTHERS_MERGE = '[BubbleTemp] others merge';
export const OTHERS_SPLIT = '[BubbleTemp] others split';
export const OTHERS_DELETE = '[BubbleTemp] others delete';
export class OthersCreate implements Action {
  readonly type = OTHERS_CREATE;
  constructor(public payload: BubbleTemp) {}
}
export class OthersEdit implements Action {
  readonly type = OTHERS_EDIT;
  constructor(public payload: BubbleTemp) {}
}
export class OthersWrap implements Action {
  readonly type = OTHERS_WRAP;
  constructor(public payload: BubbleTemp) {}
}
export class OthersPop implements Action {
  readonly type = OTHERS_POP;
  constructor(public payload: BubbleTemp) {}
}
export class OthersMerge implements Action {
  readonly type = OTHERS_MERGE;
  constructor(public payload: BubbleTemp) {}
}
export class OthersSplit implements Action {
  readonly type = OTHERS_SPLIT;
  constructor(public payload: BubbleTemp) {}
}
export class OthersDelete implements Action {
  readonly type = OTHERS_DELETE;
  constructor(public payload: BubbleTemp) {}
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
  | DeleteError
  | OthersCreate
  | OthersEdit
  | OthersWrap
  | OthersPop
  | OthersMerge
  | OthersDelete;
