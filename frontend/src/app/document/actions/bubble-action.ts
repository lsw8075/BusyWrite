import { Action } from '@ngrx/store';
import { Bubble, InternalBubble, LeafBubble } from '../models/bubble';
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

export const SELECT_SANGJUN_BOARD = '[SANGJUN BOARD] select bubble';
export class SelectSangjunBoard implements Action {
    readonly type = SELECT_SANGJUN_BOARD;
    constructor(public payload: Bubble) {}
}

export const LOAD = '[Bubble] Load';
export const LOAD_PENDING = '[Bubble] Loading';
export const LOAD_COMPLETE = '[Bubble] load Complete';
export const LOAD_ERROR = '[Bubble] load Error';
export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: number) {}
}
export class LoadPending implements Action {
    readonly type = LOAD_PENDING;
    constructor(public payload: void) {}
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
export const SELECT_CLEAR = '[Bubble] Select Clear';
export const MOUSE_OVER = '[Bubble] Mouse Over';
export const MOUSE_OUT = '[Bubble] Mouse Out';
export class Select implements Action {
  readonly type = SELECT;
  constructor(public payload: {
    bubble: Bubble,
    menu: MenuType}) {}
}
export class SelectClear implements Action {
    readonly type = SELECT_CLEAR;
    constructor(public payload ?: void) {}
}
export class MouseOver implements Action {
    readonly type = MOUSE_OVER;
    constructor(public payload: Bubble) {}
}
export class MouseOut implements Action {
    readonly type = MOUSE_OUT;
    constructor(public payload: Bubble) {}
}

export const CREATE = '[Bubble] create';
export const CREATE_PENDING = '[Bubble] create pending';
export const CREATE_COMPLETE = '[Bubble] create Complete';
export const CREATE_ERROR = '[Bubble] create Error';
export class Create implements Action {
  readonly type = CREATE;
  constructor(public payload: {
    bubbleId: number,
    isAbove: boolean}) {}
}
export class CreatePending implements Action {
  readonly type = CREATE_PENDING;
  constructor(public payload: void) {}
}
export class CreateComplete implements Action {
  readonly type = CREATE_COMPLETE;
  constructor(public payload: {
    bubbleId: number,
    isAbove: boolean
    newBubble: Bubble}) {}
}
export class CreateError implements Action {
  readonly type = CREATE_ERROR;
  constructor(public payload: string) {}
}

export const EDIT = '[Bubble] edit (check if can get edit lock)';
export const EDIT_PENDING = '[Bubble] edit pending';
export const EDIT_UPDATE = '[Bubble] edit update';
export const EDIT_UPDATE_PENDING = '[Bubble] edit update pending';
export const EDIT_COMPLETE = '[Bubble] edit Complete';
export const EDIT_COMPLETE_PENDING = '[Bubble] edit complete pending';
export const EDIT_DISCARD = '[Bubble] edit discard';
export const EDIT_DISCARD_PENDING = '[Bubble] edit discard pending';
export const EDIT_ERROR = '[Bubble] edit Error';
export class Edit implements Action {
    readonly type = EDIT;
    constructor(public payload: number) {}
}
export class EditPending implements Action {
    readonly type = EDIT_PENDING;
    constructor(public payload: void) {}
}
export class EditUpdate implements Action {
    readonly type = EDIT_UPDATE;
    constructor(public payload: number) {}
}
export class EditUpdatePending implements Action {
    readonly type = EDIT_UPDATE_PENDING;
    constructor(public payload: void) {}
}
export class EditComplete implements Action {
    readonly type = EDIT_COMPLETE;
    constructor(public payload: number) {}
}
export class EditCompletePending implements Action {
    readonly type = EDIT_COMPLETE_PENDING;
    constructor(public payload: void) {}
}
export class EditDiscard implements Action {
    readonly type = EDIT_DISCARD;
    constructor(public payload: number) {}
}
export class EditDiscardPending implements Action {
    readonly type = EDIT_DISCARD_PENDING;
    constructor(public payload: void) {}
}
export class EditError implements Action {
  readonly type = EDIT_ERROR;
  constructor(public payload: string) {}
}

export const WRAP_START = '[Bubble] wrap mode start';
export const WRAP = '[Bubble] wrap';
export const WRAP_PENDING = '[Bubble] wrap pending';
export const WRAP_COMPLETE = '[Bubble] wrap Complete';
export const WRAP_ERROR = '[Bubble] wrap Error';
export class WrapStart implements Action {
    readonly type = WRAP_START;
    constructor(public payload: Bubble) {}
}
export class Wrap implements Action {
  readonly type = WRAP;
  constructor(public payload: Array<number>) {}
}
export class WrapPending implements Action {
  readonly type = WRAP_PENDING;
  constructor(public payload: void) {}
}
export class WrapComplete implements Action {
  readonly type = WRAP_COMPLETE;
  constructor(public payload: {
      wrapBubbleIds: Array<number>
      newInternalBubble: InternalBubble}) {}
}
export class WrapError implements Action {
  readonly type = WRAP_ERROR;
  constructor(public payload: string) {}
}

export const POP = '[Bubble] pop';
export const POP_PENDING = '[Bubble] pop pending';
export const POP_COMPLETE = '[Bubble] pop Complete';
export const POP_ERROR = '[Bubble] pop Error';
export class Pop implements Action {
  readonly type = POP;
  constructor(public payload: number) {}
}
export class PopPending implements Action {
  readonly type = POP_PENDING;
  constructor(public payload: void) {}
}
export class PopComplete implements Action {
  readonly type = POP_COMPLETE;
  constructor(public payload: number) {}
}
export class PopError implements Action {
  readonly type = POP_ERROR;
  constructor(public payload: string) {}
}

export const MERGE = '[Bubble] merge';
export const MERGE_PENDING = '[Bubble] merge pending';
export const MERGE_COMPLETE = '[Bubble] merge Complete';
export const MERGE_ERROR = '[Bubble] merge Error';
export class Merge implements Action {
  readonly type = MERGE;
  constructor(public payload: Array<number>) {}
}
export class MergePending implements Action {
    readonly type = MERGE_PENDING;
    constructor(public payload: void) {}
}
export class MergeComplete implements Action {
    readonly type = MERGE_COMPLETE;
    constructor(public payload: {
        mergeBubbleIds: Array<number>
        newBubble: Bubble}) {}
}
export class MergeError implements Action {
  readonly type = MERGE_ERROR;
  constructor(public payload: string) {}
}

export const SPLIT = '[Bubble] split';
export const SPLIT_PENDING = '[Bubble] split pending';
export const SPLIT_COMPLETE = '[Bubble] split Complete';
export const SPLIT_ERROR = '[Bubble] split Error';
export class Split implements Action {
  readonly type = SPLIT;
  constructor(public payload: {
      bubbleId: number,
      contentList: Array<string>,
  }) {}
}
export class SplitPending implements Action {
  readonly type = SPLIT_PENDING;
  constructor(public payload: void) {}
}
export class SplitComplete implements Action {
  readonly type = SPLIT_COMPLETE;
  constructor(public payload: {
      bubbleId: number
      splitBubbleList: Array<Bubble>
  }) {}
}
export class SplitError implements Action {
  readonly type = SPLIT_ERROR;
  constructor(public payload: string) {}
}

export const DELETE = '[Bubble] delete';
export const DELETE_PENDING = '[Bubble] delete pending';
export const DELETE_COMPLETE = '[Bubble] delete Complete';
export const DELETE_ERROR = '[Bubble] delete Error';
export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: number) {}
}
export class DeletePending implements Action {
  readonly type = DELETE_PENDING;
  constructor(public payload: void) {}
}
export class DeleteComplete implements Action {
  readonly type = DELETE_COMPLETE;
  constructor(public payload: number) {}
}
export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
  constructor(public payload: string) {}
}

export const FLATTEN = '[Bubble] flatten';
export const FLATTEN_PENDING = '[Bubble] flatten pending';
export const FLATTEN_COMPLETE = '[Bubble] flatten Complete';
export const FLATTEN_ERROR = '[Bubble] flatten Error';
export class Flatten implements Action {
  readonly type = FLATTEN;
  constructor(public payload: number) {}
}
export class FlattenPending implements Action {
  readonly type = FLATTEN_COMPLETE;
  constructor(public payload: void) {}
}
export class FlattenComplete implements Action {
  readonly type = FLATTEN_COMPLETE;
  constructor(public payload: {
      bubbleId: number,
      newBubble: Bubble}) {}
}
export class FlattenError implements Action {
  readonly type = FLATTEN_ERROR;
  constructor(public payload: string) {}
}

export const MOVE = '[Bubble] move';
export const MOVE_PENDING = '[Bubble] move pending';
export const MOVE_COMPLETE = '[Bubble] move Complete';
export const MOVE_ERROR = '[Bubble] move Error';
export class Move implements Action {
  readonly type = MOVE;
  constructor(public payload: {
      bubbleId: number,
      destBubbleId: number,
      isAbove: boolean}) {}
}
export class MovePending implements Action {
  readonly type = MOVE_PENDING;
  constructor(public payload: void) {}
}
export class MoveComplete implements Action {
  readonly type = MOVE_COMPLETE;
  constructor(public payload: {
      bubbleId: number,
      destBubbleId: number,
      isAbove: boolean}) {}
}
export class MoveError implements Action {
  readonly type = MOVE_ERROR;
  constructor(public payload: string) {}
}

export const OTHERS_CREATE = '[Bubble] others create';
export const OTHERS_EDIT = '[Bubble] others edit';
export const OTHERS_WRAP = '[Bubble] others wrap';
export const OTHERS_POP = '[Bubble] others pop';
export const OTHERS_MERGE = '[Bubble] others merge';
export const OTHERS_SPLIT = '[Bubble] others split';
export const OTHERS_DELETE = '[Bubble] others delete';
export class OthersCreate implements Action {
  readonly type = OTHERS_CREATE;
  constructor(public payload: number) {}
}
export class OthersEdit implements Action {
  readonly type = OTHERS_EDIT;
  constructor(public payload: number) {}
}
export class OthersWrap implements Action {
  readonly type = OTHERS_WRAP;
  constructor(public payload: number) {}
}
export class OthersPop implements Action {
  readonly type = OTHERS_POP;
  constructor(public payload: number) {}
}
export class OthersMerge implements Action {
  readonly type = OTHERS_MERGE;
  constructor(public payload: number) {}
}
export class OthersSplit implements Action {
  readonly type = OTHERS_SPLIT;
  constructor(public payload: number) {}
}
export class OthersDelete implements Action {
  readonly type = OTHERS_DELETE;
  constructor(public payload: number) {}
}
export const REFRESH = '[Bubble] refresh';
export class Refresh implements Action {
  readonly type = REFRESH;
  constructor(public payload: void) {}
}

export const CLEAR_ERROR = '[Board] clear error';
export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
    constructor(public payload ?: void) {}
}

export type Actions =
  | Open
  | OpenComplete
  | OpenError
  | SelectSangjunBoard
  | Load
  | LoadPending
  | LoadComplete
  | LoadError
  | Select
  | SelectClear
  | MouseOver
  | MouseOut
  | Create
  | CreatePending
  | CreateComplete
  | CreateError
  | Edit
  | EditPending
  | EditUpdate
  | EditUpdatePending
  | EditComplete
  | EditCompletePending
  | EditDiscard
  | EditDiscardPending
  | EditError
  | WrapStart
  | Wrap
  | WrapPending
  | WrapComplete
  | WrapError
  | Pop
  | PopPending
  | PopComplete
  | PopError
  | Merge
  | MergePending
  | MergeComplete
  | MergeError
  | Split
  | SplitPending
  | SplitComplete
  | SplitError
  | Delete
  | DeletePending
  | DeleteComplete
  | DeleteError
  | Flatten
  | FlattenPending
  | FlattenComplete
  | FlattenError
  | Move
  | MovePending
  | MoveComplete
  | MoveError
  | OthersCreate
  | OthersEdit
  | OthersWrap
  | OthersPop
  | OthersMerge
  | OthersDelete
  | Refresh
  | ClearError;
