import { Action } from '@ngrx/store';
import { Bubble, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';
import { User } from '../../user/models/user';

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

export const OTHERS_OPEN_DOCUMENT = '[Document] other open';
export class OthersOpenDocument implements Action {
    readonly type = OTHERS_OPEN_DOCUMENT;
    constructor(public payload: User) {}
}

export const SELECT_SANGJUN_BOARD = '[SANGJUN BOARD] select bubble';
export class SelectSangjunBoard implements Action {
    readonly type = SELECT_SANGJUN_BOARD;
    constructor(public payload: Bubble) {}
}

export const CLOSE = '[Document] close';
export const CLOSE_PENDING = '[Document] close pending';
export const CLOSE_COMPLETE = '[Document] close complete';
export const CLOSE_ERROR = '[Document] close error';
export class Close implements Action {
    readonly type = CLOSE;
    constructor(public payload: void) {}
}
export class ClosePending implements Action {
    readonly type = CLOSE_PENDING;
    constructor(public payload: void) {}
}
export class CloseComplete implements Action {
    readonly type = CLOSE_COMPLETE;
    constructor(public payload: void) {}
}
export class CloseError implements Action {
    readonly type = CLOSE_ERROR;
    constructor(public payload: string) {}
}

export class OTHERS_CLOSE_DOCUMENT = '[Document] Other Close';
export class OthersCloseDocument implements Action {
    readonly type = OTHERS_CLOSE_DOCUMENT;
    constructor(public payload: User) {}
}

export const LOAD = '[Bubble] Load';
export const LOAD_PENDING = '[Bubble] Loading';
export const LOAD_COMPLETE = '[Bubble] Load Complete';
export const LOAD_ERROR = '[Bubble] Load Error';
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

export const LOAD_SUGGEST = '[Suggest Bubble] Load';
export const LOAD_SUGGEST_PENDING = '[Suggest Bubble] Load Pending';
export const LOAD_SUGGEST_COMPELTE = '[Suggest Bubble] Load Complete';
export const LOAD_SUGGEST_ERROR = '[Suggest Bubble] Load Error';
export class LoadSuggest implements Action {
    readonly type = LOAD_SUGGEST;
    constructor(public payload: number) {}
}
export class LoadSuggestPending implements Action {
    readonly type = LOAD_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class LoadSuggestComplete implements Action {
    readonly type = LOAD_SUGGEST_COMPLETE;
    constructor(public payload: Array<SuggestBubble>) {}
}
export class LoadSuggestError implements Action {
    readonly type = LOAD_SUGGEST_ERROR;
    constructor(public payload: string) {}
}

export const LOAD_COMMENT_ON_BUBBLE = '[Comment on Bubble] Load';
export const LOAD_COMMENT_ON_BUBBLE_PENDING = '[Comment on Bubble] Load Pending';
export const LOAD_COMMENT_ON_BUBBLE_COMPLETE = '[Comment on Bubble] Load Complete';
export const LOAD_COMMENT_ON_BUBBLE_ERROR = '[Comment on Bubble] Load Error';
export class LoadCommentOnBubble implements Action {
    readonly type = LOAD_COMMENT_ON_BUBBLE;
    constructor(public payload: number) {}
}
export class LoadCommentOnBubblePending implements Action {
    readonly type = LOAD_COMMENT_ON_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class LoadCommentOnBubbleComplete implements Action {
    readonly type = LOAD_COMMENT_ON_BUBBLE_COMPELETE;
    constructor(public payload: Array<Comment>) {}
}
export class LoadCommentOnBubbleError implements Action {
    readonly type = LOAD_COMMENT_ON_BUBBLE_ERROR;
    constructor(public payload: string) {}
}

export const LOAD_COMMENT_ON_SUGGEST = '[Comment on Suggest] Load';
export const LOAD_COMMENT_ON_SUGGEST_PENDING = '[Comment on Suggest] Load Pending';
export const LOAD_COMMENT_ON_SUGGEST_COMPLETE = '[Comment on Suggest] Load Complete';
export const LOAD_COMMENT_ON_SUGGEST_ERROR = '[Comment on Suggest] Load Error';
export class LoadCommentOnSuggest implements Action {
    readonly type = LOAD_COMMENT_ON_SUGGEST;
    constructor(public payload: number) {}
}
export class LoadCommentOnSuggestPending implements Action {
    readonly type = LOAD_COMMENT_ON_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class LoadCommentOnSuggestComplete implements Action {
    readonly type = LOAD_COMMENT_ON_SUGGEST_COMPLETE;
    constructor(public payload: Array<Comment>) {}
}
export class LoadCommentOnSuggestError implements Action {
    readonly type = LOAD_COMMENT_ON_SUGGEST_ERROR;
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
export const CREATE_PENDING = '[Bubble] create Pending';
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
  constructor(public payload: Bubble) {}
}
export class CreateError implements Action {
  readonly type = CREATE_ERROR;
  constructor(public payload: string) {}
}

export const OTHERS_CREATE = '[Bubble] others create';
export class OthersCreate implements Action {
  readonly type = OTHERS_CREATE;
  constructor(public payload: Bubble) {}
}

export const CREATE_SUGGEST = '[Suggest Bubble] create';
export const CREATE_SUGGEST_PENDING = '[Suggest Bubble] create Pending';
export const CREATE_SUGGEST_COMPLETE = '[Suggest Bubble] create Complete';
export const CREATE_SUGGEST_ERROR = '[Suggest Bubble] create Error';
export class CreateSuggest implements Action {
    readonly type = CREATE_SUGGEST;
    constructor(public payload: {
            }) {} 
}
export class CreateSuggestPending implements Action {
    readonly type = CREATE_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class CreateSuggestComplete implements Action {
    readonly type = CREATE_SUGGEST_COMPELTE;
    constructor(public payload: suggestBubble) {}
}
export class CreateSuggestError implements Action {
    readonly type = CREATE_SUGGEST_ERROR;
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
    constructor() {}
}
export class Wrap implements Action {
  readonly type = WRAP;
  constructor() {}
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

export const MERGE_START = '[Bubble] merge start';
export const MERGE = '[Bubble] merge';
export const MERGE_PENDING = '[Bubble] merge pending';
export const MERGE_COMPLETE = '[Bubble] merge Complete';
export const MERGE_ERROR = '[Bubble] merge Error';
export class MergeStart implements Action {
    readonly type = MERGE_START;
    constructor() {}
}
export class Merge implements Action {
  readonly type = MERGE;
  constructor() {}
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
  readonly type = FLATTEN_PENDING;
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

export const OTHERS_EDIT = '[Bubble] others edit';
export const OTHERS_WRAP = '[Bubble] others wrap';
export const OTHERS_POP = '[Bubble] others pop';
export const OTHERS_MERGE = '[Bubble] others merge';
export const OTHERS_SPLIT = '[Bubble] others split';
export const OTHERS_DELETE = '[Bubble] others delete';
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
  | MergeStart
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
