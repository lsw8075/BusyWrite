import { Action } from '@ngrx/store';
import { Bubble, InternalBubble, LeafBubble, SuggestBubble, Suggest } from '../models/bubble';
import { Comment } from '../models/comment';
import { Note } from '../models/note';
import { User } from '../../user/models/user';
import { Document } from '../../file/models/document';
import { MenuType } from '../services/event/event-bubble.service';

export const CHANGE_TITLE = '[Document] change title';
export const CHANGE_TITLE_PENDING = '[Document] change title pending';
export const CHANGE_TITLE_COMPLETE = '[Document] change title complete';
export const CHANGE_TITLE_ERROR = '[Document] change title error';
export const OTHERS_CHANGE_TITLE = '[Document] others change title';
export const TITLE_RESET = '[Document] title reset';
export class ChangeTitle implements Action {
    readonly type = CHANGE_TITLE;
    constructor(public payload: string) {}
}
export class ChangeTitlePending implements Action {
    readonly type = CHANGE_TITLE_PENDING;
    constructor(public payload: void) {}
}
export class ChangeTitleComplete implements Action {
    readonly type = CHANGE_TITLE_COMPLETE;
    constructor(public payload: string) {}
}
export class ChangeTitleError implements Action {
    readonly type = CHANGE_TITLE_ERROR;
    constructor(public payload: string) {}
}
export class OthersChangeTitle implements Action {
    readonly type = OTHERS_CHANGE_TITLE;
    constructor(public payload: string) {}
}
export class TitleReset implements Action {
    readonly type = TITLE_RESET;
    constructor() {}
}


export const OPEN = '[Document] open';
export const OPEN_COMPLETE = '[Document] open complete';
export const OPEN_PENDING = '[Document] open pending';
export const OPEN_ERROR = '[Document] open error';
export class Open implements Action {
  readonly type = OPEN;
  constructor() {}
}
export class OpenPending implements Action {
  readonly type = OPEN_PENDING;
  constructor(public payload: void) {}
}
export class OpenComplete implements Action {
  readonly type = OPEN_COMPLETE;
  constructor(public payload: {
      documentObject: Document,
      connectors: Array<User>
  }) {}
}
export class OpenError implements Action {
  readonly type = OPEN_ERROR;
  constructor(public payload: string) {}
}

export const OTHERS_OPEN_DOCUMENT = '[Document] other open';
export class OthersOpenDocument implements Action {
    readonly type = OTHERS_OPEN_DOCUMENT;
    constructor(public payload: number) {}
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
    constructor(public payload: string) {}
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

export const OTHERS_CLOSE_DOCUMENT = '[Document] Other Close';
export class OthersCloseDocument implements Action {
    readonly type = OTHERS_CLOSE_DOCUMENT;
    constructor(public payload: number) {}
}

export const OTHERS_ADDED_AS_CONTRIBUTOR = '[Document] contributor added';
export class OthersAddedAsContributor implements Action {
    readonly type = OTHERS_ADDED_AS_CONTRIBUTOR;
    constructor(public payload: User) {}
}

export const LOAD = '[Bubble] Load';
export const LOAD_PENDING = '[Bubble] load pending';
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
    constructor(public payload: {
        bubbleList: Array<Bubble>,
        suggestBubbleList: Array<SuggestBubble>,
        commentList: Array<Comment>,
        noteList: Array<Note>}) {}
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

export const CREATE_BUBBLE = '[Bubble] create';
export const CREATE_BUBBLE_PENDING = '[Bubble] create Pending';
export const CREATE_BUBBLE_COMPLETE = '[Bubble] create Complete';
export const CREATE_BUBBLE_ERROR = '[Bubble] create Error';
export const OTHERS_CREATE_BUBBLE = '[Bubble] others create';
export class CreateBubble implements Action {
  readonly type = CREATE_BUBBLE;
  constructor(public payload: {
    bubbleId: number,
    isAbove: boolean}) {}
}
export class CreateBubblePending implements Action {
  readonly type = CREATE_BUBBLE_PENDING;
  constructor(public payload: void) {}
}
export class CreateBubbleComplete implements Action {
  readonly type = CREATE_BUBBLE_COMPLETE;
  constructor(public payload: Bubble) {}
}
export class CreateBubbleError implements Action {
  readonly type = CREATE_BUBBLE_ERROR;
  constructor(public payload: string) {}
}

export class OthersCreateBubble implements Action {
  readonly type = OTHERS_CREATE_BUBBLE;
  constructor(public payload: Bubble) {}
}

export const CREATE_SUGGEST_START = '[Suggest Bubble] create start';
export class CreateSuggestStart implements Action {
    readonly type = CREATE_SUGGEST_START;
    constructor(public payload: Suggest) {}
}

export const CREATE_SUGGEST = '[Suggest Bubble] create';
export const CREATE_SUGGEST_PENDING = '[Suggest Bubble] create Pending';
export const CREATE_SUGGEST_COMPLETE = '[Suggest Bubble] create Complete';
export const CREATE_SUGGEST_ERROR = '[Suggest Bubble] create Error';
export const OTHERS_CREATE_SUGGEST = '[Suggest Bubble] others create';
export class CreateSuggest implements Action {
    readonly type = CREATE_SUGGEST;
    constructor(public payload: Suggest) {}
}
export class CreateSuggestPending implements Action {
    readonly type = CREATE_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class CreateSuggestComplete implements Action {
    readonly type = CREATE_SUGGEST_COMPLETE;
    constructor(public payload: {
        suggestBubble: SuggestBubble,
        suggest: Suggest
    }) {}
}
export class CreateSuggestError implements Action {
    readonly type = CREATE_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersCreateSuggest implements Action {
  readonly type = OTHERS_CREATE_SUGGEST;
  constructor(public payload: SuggestBubble) {}
}


export const CREATE_COMMENT_ON_BUBBLE = '[Comment on Bubble] create';
export const CREATE_COMMENT_ON_BUBBLE_PENDING = '[Comment on Bubble] create Pending';
export const CREATE_COMMENT_ON_BUBBLE_COMPLETE = '[Comment on Bubble] create complete';
export const CREATE_COMMENT_ON_BUBBLE_ERROR = '[Comment on Bubble] create error';
export const OTHERS_CREATE_COMMENT_ON_BUBBLE = '[Comment on Bubble] others create';
export class CreateCommentOnBubble implements Action {
    readonly type = CREATE_COMMENT_ON_BUBBLE;
    constructor(public payload: {
            bindBubbleId: number,
            content: string
            }) {}
}
export class CreateCommentOnBubblePending implements Action {
    readonly type = CREATE_COMMENT_ON_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class CreateCommentOnBubbleComplete implements Action {
    readonly type = CREATE_COMMENT_ON_BUBBLE_COMPLETE;
    constructor(public payload: Comment) {}
}
export class CreateCommentOnBubbleError implements Action {
    readonly type = CREATE_COMMENT_ON_BUBBLE_ERROR;
    constructor(public payload: string) {}
}
export class OthersCreateCommentOnBubble implements Action {
    readonly type = OTHERS_CREATE_COMMENT_ON_BUBBLE;
    constructor(public payload: Comment) {}
}

export const CREATE_COMMENT_ON_SUGGEST = '[Comment on Suggest] create';
export const CREATE_COMMENT_ON_SUGGEST_PENDING = '[Comment on Suggest] create Pending';
export const CREATE_COMMENT_ON_SUGGEST_COMPLETE = '[Comment on Suggest] create complete';
export const CREATE_COMMENT_ON_SUGGEST_ERROR = '[Comment on Suggest] create error';
export const OTHERS_CREATE_COMMENT_ON_SUGGEST = '[Comment on Suggest] others create';
export class CreateCommentOnSuggest implements Action {
    readonly type = CREATE_COMMENT_ON_SUGGEST;
    constructor(public payload: {
            bindSuggestBubbleId: number,
            content: string
            }) {}
}
export class CreateCommentOnSuggestPending implements Action {
    readonly type = CREATE_COMMENT_ON_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class CreateCommentOnSuggestComplete implements Action {
    readonly type = CREATE_COMMENT_ON_SUGGEST_COMPLETE;
    constructor(public payload: Comment) {}
}
export class CreateCommentOnSuggestError implements Action {
    readonly type = CREATE_COMMENT_ON_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersCreateCommentOnSuggest implements Action {
    readonly type = OTHERS_CREATE_COMMENT_ON_SUGGEST;
    constructor(public payload: Comment) {}
}

export const EDIT_BUBBLE = '[Bubble] edit (check if can get edit lock)';
export const EDIT_BUBBLE_PENDING = '[Bubble] edit pending';
export const EDIT_REQUEST_SUCCESS = '[Bubble] edit success';
export const OTHERS_EDIT_REQUEST = '[Bubble] others edit';
export const EDIT_UPDATE = '[Bubble] edit update';
export const EDIT_UPDATE_RESUME = '[Bubble] edit update resume';
export const EDIT_UPDATE_PENDING = '[Bubble] edit update pending';
export const EDIT_UPDATE_SUCCESS = '[Bubble] edit update success';
export const OTHERS_EDIT_UPDATE = '[Bubble] others edit update';
export const EDIT_COMPLETE = '[Bubble] edit Complete';
export const EDIT_COMPLETE_PENDING = '[Bubble] edit complete pending';
export const EDIT_COMPLETE_SUCCESS = '[Bubble] edit complete success';
export const OTHERS_EDIT_COMPLETE = '[Bubble] others edit complete';
export const EDIT_DISCARD = '[Bubble] edit discard';
export const EDIT_DISCARD_PENDING = '[Bubble] edit discard pending';
export const EDIT_DISCARD_SUCCESS = '[Bubble] edit discard success';
export const OTHERS_EDIT_DISCARD = '[Bubble] others edit discard';
export const EDIT_BUBBLE_ERROR = '[Bubble] edit Error';
export class EditBubble implements Action {
    readonly type = EDIT_BUBBLE;
    constructor(public payload: number) {}
}
export class EditBubblePending implements Action {
    readonly type = EDIT_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class EditRequestSuccess implements Action {
    readonly type = EDIT_REQUEST_SUCCESS;
    constructor(public payload: {
        bubbleId: number,
        userId: number
    }) {}
}
export class OthersEditRequest implements Action {
    readonly type = OTHERS_EDIT_REQUEST;
    constructor(public payload: {
            bubbleId: number
            userId: number}) {}
}
export class EditUpdate implements Action {
    readonly type = EDIT_UPDATE;
    constructor(public payload: {
            bubbleId: number,
            content: string}) {}
}
export class EditUpdateResume implements Action {
    readonly type = EDIT_UPDATE_RESUME;
    constructor(public payload: {
            bubbleId: number,
            content: string}) {}
}
export class EditUpdatePending implements Action {
    readonly type = EDIT_UPDATE_PENDING;
    constructor(public payload: void) {}
}
export class EditUpdateSuccess implements Action {
    readonly type = EDIT_UPDATE_SUCCESS;
    constructor(public payload: {
            bubbleId: number,
            content: string}) {}
}
export class OthersEditUpdate implements Action {
    readonly type = OTHERS_EDIT_UPDATE;
    constructor(public payload: {
            bubbleId: number,
            content: string}) {}
}
export class EditComplete implements Action {
    readonly type = EDIT_COMPLETE;
    constructor(public payload: {
            bubbleId: number,
            content: string}) {}
}
export class EditCompletePending implements Action {
    readonly type = EDIT_COMPLETE_PENDING;
    constructor(public payload: void) {}
}
export class EditCompleteSuccess implements Action {
    readonly type = EDIT_COMPLETE_SUCCESS;
    constructor(public payload: {
            bubbleId: number,
            content: string}) {}
}
export class OthersEditComplete implements Action {
    readonly type = OTHERS_EDIT_COMPLETE;
    constructor(public payload: {
            bubbleId: number,
            content: string}) {}
}
export class EditDiscard implements Action {
    readonly type = EDIT_DISCARD;
    constructor(public payload: number) {}
}
export class EditDiscardPending implements Action {
    readonly type = EDIT_DISCARD_PENDING;
    constructor(public payload: void) {}
}
export class EditDiscardSuccess implements Action {
    readonly type = EDIT_DISCARD_SUCCESS;
    constructor(public payload: {
        bubbleId: number,
        content: string
    }) {}
}
export class OthersEditDiscard implements Action {
    readonly type = OTHERS_EDIT_DISCARD;
    constructor(public payload: {
        bubbleId: number,
        content: string
    }) {}
}
export class EditBubbleError implements Action {
    readonly type = EDIT_BUBBLE_ERROR;
    constructor(public payload: string) {}
}

export const RELEASE_OWNERSHIP = '[Bubble] release ownership';
export const RELEASE_ONWERSHIP_PENDING = '[Bubble] release ownership pending';
export const RELEASE_OWNERSHIP_COMPLETE = '[Bubble] release onwership complete';
export const RELEASE_OWNERSHIP_ERROR = '[Bubble] release ownership error';
export const OTHERS_RELEASE_OWNERSHIP = '[Bubble] others release ownership';
export class ReleaseOwnership implements Action {
    readonly type = RELEASE_OWNERSHIP;
    constructor(public payload: number) {}
}
export class ReleaseOwnershipPending implements Action {
    readonly type = RELEASE_ONWERSHIP_PENDING;
    constructor(public payload: void) {}
}
export class ReleaseOwnershipComplete implements Action {
    readonly type = RELEASE_OWNERSHIP_COMPLETE;
    constructor(public payload: number) {}
}
export class ReleaseOwnershipError implements Action {
    readonly type = RELEASE_OWNERSHIP_ERROR;
    constructor(public payload: number) {}
}
export class OthersReleaseOwnership implements Action {
    readonly type = OTHERS_RELEASE_OWNERSHIP;
    constructor(public payload: number) {}
}

export const EDIT_SUGGEST_FINISH = '[Suggest Bubble] edit suggest finish';
export const EDIT_SUGGEST_DISCARD = '[Suggest Bubble] edit suggest discard';
export const EDIT_SUGGEST_DISCARD_COMPLETE = '[Suggest Bubble] edit suggest discard complete';
export class EditSuggestFinish implements Action {
    readonly type = EDIT_SUGGEST_FINISH;
    constructor(public payload: Suggest) {}
}
export class EditSuggestDiscard implements Action {
    readonly type = EDIT_SUGGEST_DISCARD;
    constructor(public payload: Suggest) {}
}
export class EditSuggestDiscardComplete implements Action {
    readonly type = EDIT_SUGGEST_DISCARD_COMPLETE;
    constructor(public payload: Suggest) {}
}

export const EDIT_SUGGEST = '[Suggest Bubble] edit';
export const EDIT_SUGGEST_PENDING = '[Suggest Bubble] edit pending';
export const EDIT_SUGGEST_COMPLETE = '[Suggest Bubble] edit complete';
export const EDIT_SUGGEST_ERROR = '[Suggest Bubble] edit discard';
export const OTHERS_EDIT_SUGGEST = '[Suggest Bubble] others edit suggest';
export class EditSuggest implements Action {
    readonly type = EDIT_SUGGEST;
    constructor(public payload: Suggest) {}
}
export class EditSuggestPending implements Action {
    readonly type = EDIT_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class EditSuggestComplete implements Action {
    readonly type = EDIT_SUGGEST_COMPLETE;
    constructor(public payload: {
            suggest: Suggest,
            hidedSuggestBubbleId: number,
            newEdittedSuggestBubble: SuggestBubble}) {}
}
export class EditSuggestError implements Action {
    readonly type = EDIT_SUGGEST_ERROR;
    constructor(public payload: number) {}
}
export class OthersEditSuggest implements Action {
    readonly type = OTHERS_EDIT_SUGGEST;
    constructor(public payload: {
            hidedSuggestBubbleId: number,
            newEdittedSuggestBubble: SuggestBubble}) {}
}

export const EDIT_COMMENT_ON_BUBBLE = '[Comment on Bubble] edit';
export const EDIT_COMMENT_ON_BUBBLE_PENDING = '[Comment on Bubble] edit pending';
export const EDIT_COMMENT_ON_BUBBLE_COMPLETE = '[Comment on Bubble] edit complete';
export const EDIT_COMMENT_ON_BUBBLE_ERROR = '[Comment on Bubble] edit discard';
export const OTHERS_EDIT_COMMENT_ON_BUBBLE = '[Comment on Bubble] others edit suggest';
export class EditCommentOnBubble implements Action {
    readonly type = EDIT_COMMENT_ON_BUBBLE;
    constructor(public payload: number) {}
}
export class EditCommentOnBubblePending implements Action {
    readonly type = EDIT_COMMENT_ON_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class EditCommentOnBubbleComplete implements Action {
    readonly type = EDIT_COMMENT_ON_BUBBLE_COMPLETE;
    constructor(public payload: {
            commentId: number,
            content: string}) {}
}
export class EditCommentOnBubbleError implements Action {
    readonly type = EDIT_COMMENT_ON_BUBBLE_ERROR;
    constructor(public payload: number) {}
}
export class OthersEditCommentOnBubble implements Action {
    readonly type = OTHERS_EDIT_COMMENT_ON_BUBBLE;
    constructor(public payload: {
            commentId: number,
            content: string}) {}
}

export const EDIT_COMMENT_ON_SUGGEST = '[Comment on Suggest] edit';
export const EDIT_COMMENT_ON_SUGGEST_PENDING = '[Comment on Suggest] edit pending';
export const EDIT_COMMENT_ON_SUGGEST_COMPLETE = '[Comment on Suggest] edit complete';
export const EDIT_COMMENT_ON_SUGGEST_ERROR = '[Comment on Suggest] edit discard';
export const OTHERS_EDIT_COMMENT_ON_SUGGEST = '[Comment on Suggest] others edit suggest';
export class EditCommentOnSuggest implements Action {
    readonly type = EDIT_COMMENT_ON_SUGGEST;
    constructor(public payload: number) {}
}
export class EditCommentOnSuggestPending implements Action {
    readonly type = EDIT_COMMENT_ON_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class EditCommentOnSuggestComplete implements Action {
    readonly type = EDIT_COMMENT_ON_SUGGEST_COMPLETE;
    constructor(public payload: {
            commentId: number,
            content: string}) {}
}
export class EditCommentOnSuggestError implements Action {
    readonly type = EDIT_COMMENT_ON_SUGGEST_ERROR;
    constructor(public payload: number) {}
}
export class OthersEditCommentOnSuggest implements Action {
    readonly type = OTHERS_EDIT_COMMENT_ON_SUGGEST;
    constructor(public payload: {
            commentId: number,
            content: string}) {}
}

export const DELETE_BUBBLE = '[Bubble] delete';
export const DELETE_BUBBLE_PENDING = '[Bubble] delete pending';
export const DELETE_BUBBLE_COMPLETE = '[Bubble] delete Complete';
export const DELETE_BUBBLE_ERROR = '[Bubble] delete Error';
export const OTHERS_DELETE_BUBBLE = '[Bubble] others delete';
export class DeleteBubble implements Action {
  readonly type = DELETE_BUBBLE;
  constructor(public payload: number) {}
}
export class DeleteBubblePending implements Action {
  readonly type = DELETE_BUBBLE_PENDING;
  constructor(public payload: void) {}
}
export class DeleteBubbleComplete implements Action {
  readonly type = DELETE_BUBBLE_COMPLETE;
  constructor(public payload: number) {}
}
export class DeleteBubbleError implements Action {
  readonly type = DELETE_BUBBLE_ERROR;
  constructor(public payload: string) {}
}
export class OthersDeleteBubble implements Action {
  readonly type = OTHERS_DELETE_BUBBLE;
  constructor(public payload: number) {}
}

export const HIDE_SUGGEST = '[Suggest Bubble] hide';
export const HIDE_SUGGEST_PENDING = '[Suggest Bubble] hide pending';
export const HIDE_SUGGEST_COMPLETE = '[Suggest Bubble] hide complete';
export const HIDE_SUGGEST_ERROR = '[Suggest Bubble] hide error';
export const OTHERS_HIDE_SUGGEST = '[Suggest Bubble] others hide';
export class HideSuggest implements Action {
    readonly type = HIDE_SUGGEST;
    constructor(public payload: number) {}
}
export class HideSuggestPending implements Action {
    readonly type = HIDE_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class HideSuggestComplete implements Action {
    readonly type = HIDE_SUGGEST_COMPLETE;
    constructor(public payload: number) {}
}
export class HideSuggestError implements Action {
    readonly type = HIDE_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersHideSuggest implements Action {
    readonly type = OTHERS_HIDE_SUGGEST;
    constructor(public payload: number) {}
}

export const SHOW_SUGGEST = '[Suggest Bubble] show';
export const SHOW_SUGGEST_PENDING = '[Suggest Bubble] show pending';
export const SHOW_SUGGEST_COMPLETE = '[Suggest Bubble] show complete';
export const SHOW_SUGGEST_ERROR = '[Suggest Bubble] show error';
export const OTHERS_SHOW_SUGGEST = '[Suggest Bubble] others show';
export class ShowSuggest implements Action {
    readonly type = SHOW_SUGGEST;
    constructor(public payload: number) {}
}
export class ShowSuggestPending implements Action {
    readonly type = SHOW_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class ShowSuggestComplete implements Action {
    readonly type = SHOW_SUGGEST_COMPLETE;
    constructor(public payload: number) {}
}
export class ShowSuggestError implements Action {
    readonly type = SHOW_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersShowSuggest implements Action {
    readonly type = OTHERS_SHOW_SUGGEST;
    constructor(public payload: number) {}
}

export const DELETE_COMMENT_ON_BUBBLE = '[Comment on Bubble] delete';
export const DELETE_COMMENT_ON_BUBBLE_PENDING = '[Comment on Bubble] delete pending';
export const DELETE_COMMENT_ON_BUBBLE_COMPLETE = '[Comment on Bubble] delete complete';
export const DELETE_COMMENT_ON_BUBBLE_ERROR = '[Comment on Bubble] delete error';
export const OTHERS_DELETE_COMMENT_ON_BUBBLE = '[Comment on Bubble] others delete';
export class DeleteCommentOnBubble implements Action {
    readonly type = DELETE_COMMENT_ON_BUBBLE;
    constructor(public payload: number) {}
}
export class DeleteCommentOnBubblePending implements Action {
    readonly type = DELETE_COMMENT_ON_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class DeleteCommentOnBubbleComplete implements Action {
    readonly type = DELETE_COMMENT_ON_BUBBLE_COMPLETE;
    constructor(public payload: number) {}
}
export class DeleteCommentOnBubbleError implements Action {
    readonly type = DELETE_COMMENT_ON_BUBBLE_ERROR;
    constructor(public payload: string) {}
}
export class OthersDeleteCommentOnBubble implements Action {
    readonly type = OTHERS_DELETE_COMMENT_ON_BUBBLE;
    constructor(public payload: number) {}
}

export const DELETE_COMMENT_ON_SUGGEST = '[Comment on Suggest] delete';
export const DELETE_COMMENT_ON_SUGGEST_PENDING = '[Comment on Suggest] delete pending';
export const DELETE_COMMENT_ON_SUGGEST_COMPLETE = '[Comment on Suggest] delete complete';
export const DELETE_COMMENT_ON_SUGGEST_ERROR = '[Comment on Suggest] delete error';
export const OTHERS_DELETE_COMMENT_ON_SUGGEST = '[Comment on Suggest] others delete';
export class DeleteCommentOnSuggest implements Action {
    readonly type = DELETE_COMMENT_ON_SUGGEST;
    constructor(public payload: number) {}
}
export class DeleteCommentOnSuggestPending implements Action {
    readonly type = DELETE_COMMENT_ON_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class DeleteCommentOnSuggestComplete implements Action {
    readonly type = DELETE_COMMENT_ON_SUGGEST_COMPLETE;
    constructor(public payload: number) {}
}
export class DeleteCommentOnSuggestError implements Action {
    readonly type = DELETE_COMMENT_ON_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersDeleteCommentOnSuggest implements Action {
    readonly type = OTHERS_DELETE_COMMENT_ON_SUGGEST;
    constructor(public payload: number) {}
}

export const MOVE_BUBBLE_START = '[Bubble] move start';
export const MOVE_BUBBLE = '[Bubble] move';
export const MOVE_BUBBLE_PENDING = '[Bubble] move pending';
export const MOVE_BUBBLE_COMPLETE = '[Bubble] move Complete';
export const MOVE_BUBBLE_ERROR = '[Bubble] move Error';
export const OTHERS_MOVE_BUBBLE = '[Bubble] others move';
export class MoveBubbleStart implements Action {
    readonly type = MOVE_BUBBLE_START;
    constructor(public payload: Bubble) {}
}
export class MoveBubble implements Action {
  readonly type = MOVE_BUBBLE;
  constructor(public payload: {
      bubbleId: number,
      destBubbleId: number,
      isAbove: boolean}) {}
}
export class MoveBubblePending implements Action {
  readonly type = MOVE_BUBBLE_PENDING;
  constructor(public payload: void) {}
}
export class MoveBubbleComplete implements Action {
  readonly type = MOVE_BUBBLE_COMPLETE;
  constructor(public payload: {
      bubbleId: number,
      newParentId: number,
      newLocation: number}) {}
}
export class MoveBubbleError implements Action {
  readonly type = MOVE_BUBBLE_ERROR;
  constructor(public payload: string) {}
}
export class OthersMoveBubble implements Action {
  readonly type = OTHERS_MOVE_BUBBLE;
  constructor(public payload: {
      bubbleId: number,
      newParentId: number,
      newLocation: number}) {}
}

export const WRAP_START = '[Bubble] wrap mode start';
export const WRAP_BUBBLE = '[Bubble] wrap';
export const WRAP_BUBBLE_PENDING = '[Bubble] wrap pending';
export const WRAP_BUBBLE_COMPLETE = '[Bubble] wrap Complete';
export const WRAP_BUBBLE_ERROR = '[Bubble] wrap Error';
export const OTHERS_WRAP_BUBBLE = '[Bubble] others wrap';
export class WrapStart implements Action {
    readonly type = WRAP_START;
    constructor() {}
}
export class WrapBubble implements Action {
  readonly type = WRAP_BUBBLE;
  constructor() {}
}
export class WrapBubblePending implements Action {
  readonly type = WRAP_BUBBLE_PENDING;
  constructor(public payload: void) {}
}
export class WrapBubbleComplete implements Action {
  readonly type = WRAP_BUBBLE_COMPLETE;
  constructor(public payload: {
      wrapBubbleIdList: Array<number>
      newWrappedBubble: Bubble}) {}
}
export class WrapBubbleError implements Action {
  readonly type = WRAP_BUBBLE_ERROR;
  constructor(public payload: string) {}
}
export class OthersWrapBubble implements Action {
  readonly type = OTHERS_WRAP_BUBBLE;
  constructor(public payload: {
      wrapBubbleIdList: Array<number>
      newWrappedBubble: Bubble}) {}
}

export const POP_BUBBLE = '[Bubble] pop';
export const POP_BUBBLE_PENDING = '[Bubble] pop pending';
export const POP_BUBBLE_COMPLETE = '[Bubble] pop Complete';
export const POP_BUBBLE_ERROR = '[Bubble] pop Error';
export const OTHERS_POP_BUBBLE = '[Bubble] others pop';
export class PopBubble implements Action {
  readonly type = POP_BUBBLE;
  constructor(public payload: number) {}
}
export class PopBubblePending implements Action {
  readonly type = POP_BUBBLE_PENDING;
  constructor(public payload: void) {}
}
export class PopBubbleComplete implements Action {
  readonly type = POP_BUBBLE_COMPLETE;
  constructor(public payload: number) {}
}
export class PopBubbleError implements Action {
  readonly type = POP_BUBBLE_ERROR;
  constructor(public payload: string) {}
}
export class OthersPopBubble implements Action {
  readonly type = OTHERS_POP_BUBBLE;
  constructor(public payload: number) {}
}

export const SPLIT_INTERNAL_START = '[Internal Bubble] split action';
export const SPLIT_INTERNAL = '[Internal Bubble] split';
export const SPLIT_INTERNAL_PENDING = '[Internal Bubble] split pending';
export const SPLIT_INTERNAL_COMPLETE = '[Internal Bubble] split Complete';
export const SPLIT_INTERNAL_ERROR = '[Internal Bubble] split Error';
export const OTHERS_SPLIT_INTERNAL = '[Internal Bubble] others split';
export class SplitInternalStart implements Action {
    readonly type = SPLIT_INTERNAL_START;
    constructor(public payload: Bubble) {}
}
export class SplitInternal implements Action {
  readonly type = SPLIT_INTERNAL;
  constructor(public payload: {
      bubbleId: number,
      splitBubbleIdList: Array<number>,
  }) {}
}
export class SplitInternalPending implements Action {
  readonly type = SPLIT_INTERNAL_PENDING;
  constructor(public payload: void) {}
}
export class SplitInternalComplete implements Action {
  readonly type = SPLIT_INTERNAL_COMPLETE;
  constructor(public payload: {
      bubbleId: number
      splitBubbleObjectList: Array<Bubble>
  }) {}
}
export class SplitInternalError implements Action {
  readonly type = SPLIT_INTERNAL_ERROR;
  constructor(public payload: string) {}
}
export class OthersSplitInternal implements Action {
    readonly type = OTHERS_SPLIT_INTERNAL;
    constructor(public payload: {
        bubbleId: number
        splitBubbleObjectList: Array<Bubble>
    }) {}
}

export const SPLIT_LEAF_START = '[Leaf Bubble] split start';
export const SPLIT_LEAF = '[Leaf Bubble] split';
export const SPLIT_LEAF_PENDING = '[Leaf Bubble] split pending';
export const SPLIT_LEAF_COMPLETE = '[Leaf Bubble] split Complete';
export const SPLIT_LEAF_ERROR = '[Leaf Bubble] split Error';
export const OTHERS_SPLIT_LEAF = '[Leaf Bubble] others split';
export class SplitLeafStart implements Action {
    readonly type = SPLIT_LEAF_START;
    constructor(public payload: Bubble) {}
}
export class SplitLeaf implements Action {
  readonly type = SPLIT_LEAF;
  constructor(public payload: {
      bubbleId: number,
      contentList: Array<string>,
  }) {}
}
export class SplitLeafPending implements Action {
  readonly type = SPLIT_LEAF_PENDING;
  constructor(public payload: void) {}
}
export class SplitLeafComplete implements Action {
  readonly type = SPLIT_LEAF_COMPLETE;
  constructor(public payload: {
      bubbleId: number
      splitBubbleObjectList: Array<Bubble>
  }) {}
}
export class SplitLeafError implements Action {
  readonly type = SPLIT_LEAF_ERROR;
  constructor(public payload: string) {}
}
export class OthersSplitLeaf implements Action {
  readonly type = OTHERS_SPLIT_LEAF;
  constructor(public payload: {
      bubbleId: number
      splitBubbleObjectList: Array<Bubble>
  }) {}
}

export const MERGE_START = '[Bubble] merge start';
export const MERGE_BUBBLE = '[Bubble] merge';
export const MERGE_BUBBLE_PENDING = '[Bubble] merge pending';
export const MERGE_BUBBLE_COMPLETE = '[Bubble] merge Complete';
export const MERGE_BUBBLE_ERROR = '[Bubble] merge Error';
export const OTHERS_MERGE_BUBBLE = '[Bubble] others merge';
export class MergeStart implements Action {
    readonly type = MERGE_START;
    constructor() {}
}
export class MergeBubble implements Action {
  readonly type = MERGE_BUBBLE;
  constructor() {}
}
export class MergeBubblePending implements Action {
    readonly type = MERGE_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class MergeBubbleComplete implements Action {
    readonly type = MERGE_BUBBLE_COMPLETE;
    constructor(public payload: {
        bubbleIdList: Array<number>
        mergedBubble: Bubble}) {}
}
export class MergeBubbleError implements Action {
  readonly type = MERGE_BUBBLE_ERROR;
  constructor(public payload: string) {}
}
export class OthersMergeBubble implements Action {
    readonly type = OTHERS_MERGE_BUBBLE;
    constructor(public payload: {
        bubbleIdList: Array<number>
        mergedBubble: Bubble}) {}
}

export const FLATTEN_BUBBLE = '[Bubble] flatten';
export const FLATTEN_BUBBLE_PENDING = '[Bubble] flatten pending';
export const FLATTEN_BUBBLE_COMPLETE = '[Bubble] flatten Complete';
export const FLATTEN_BUBBLE_ERROR = '[Bubble] flatten Error';
export const OTHERS_FLATTEN_BUBBLE = '[Bubble] others flatten';
export class FlattenBubble implements Action {
  readonly type = FLATTEN_BUBBLE;
  constructor(public payload: number) {}
}
export class FlattenBubblePending implements Action {
  readonly type = FLATTEN_BUBBLE_PENDING;
  constructor(public payload: void) {}
}
export class FlattenBubbleComplete implements Action {
  readonly type = FLATTEN_BUBBLE_COMPLETE;
  constructor(public payload: number) {}
}
export class FlattenBubbleError implements Action {
  readonly type = FLATTEN_BUBBLE_ERROR;
  constructor(public payload: string) {}
}
export class OthersFlattenBubble implements Action {
  readonly type = OTHERS_FLATTEN_BUBBLE;
  constructor(public payload: number) {}
}

export const SWITCH_BUBBLE = '[Bubble] switch';
export const SWITCH_BUBBLE_PENDING = '[Bubble] switch pending';
export const SWITCH_BUBBLE_COMPLETE = '[Bubble] switch Complete';
export const SWITCH_BUBBLE_ERROR = '[Bubble] switch Error';
export const OTHERS_SWITCH_BUBBLE = '[Bubble] others switch';
export class SwitchBubble implements Action {
  readonly type = SWITCH_BUBBLE;
  constructor(public payload: number) {}
}
export class SwitchBubblePending implements Action {
  readonly type = SWITCH_BUBBLE_PENDING;
  constructor(public payload: void) {}
}
export class SwitchBubbleComplete implements Action {
  readonly type = SWITCH_BUBBLE_COMPLETE;
  constructor(public payload: number) {}
}
export class SwitchBubbleError implements Action {
  readonly type = SWITCH_BUBBLE_ERROR;
  constructor(public payload: string) {}
}
export class OthersSwitchBubble implements Action {
  readonly type = OTHERS_SWITCH_BUBBLE;
  constructor(public payload: number) {}
}

export const VOTE_ON_SUGGEST = '[Suggest Bubble] vote';
export const VOTE_ON_SUGGEST_PENDING = '[Suggest Bubble] vote pending';
export const VOTE_ON_SUGGEST_COMPLETE = '[Suggest Bubble] vote complete';
export const VOTE_ON_SUGGEST_ERROR = '[Suggest Bubble] vote error';
export const OTHERS_VOTE_ON_SUGGEST = '[Suggest Bubble] others vote';
export class VoteOnSuggest implements Action {
    readonly type = VOTE_ON_SUGGEST;
    constructor(public payload: number) {}
}
export class VoteOnSuggestPending implements Action {
    readonly type = VOTE_ON_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class VoteOnSuggestComplete implements Action {
    readonly type = VOTE_ON_SUGGEST_COMPLETE;
    constructor(public payload: number) {}
}
export class VoteOnSuggestError implements Action {
    readonly type = VOTE_ON_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersVoteOnSuggest implements Action {
    readonly type = OTHERS_VOTE_ON_SUGGEST;
    constructor(public payload: number) {}
}

export const UNVOTE_ON_SUGGEST = '[Suggest Bubble] unvote';
export const UNVOTE_ON_SUGGEST_PENDING = '[Suggest Bubble] unvote pending';
export const UNVOTE_ON_SUGGEST_COMPLETE = '[Suggest Bubble] unvote complete';
export const UNVOTE_ON_SUGGEST_ERROR = '[Suggest Bubble] unvote error';
export const OTHERS_UNVOTE_ON_SUGGEST = '[Suggest Bubble] others unvote';
export class UnvoteOnSuggest implements Action {
    readonly type = UNVOTE_ON_SUGGEST;
    constructor(public payload: number) {}
}
export class UnvoteOnSuggestPending implements Action {
    readonly type = UNVOTE_ON_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class UnvoteOnSuggestComplete implements Action {
    readonly type = UNVOTE_ON_SUGGEST_COMPLETE;
    constructor(public payload: number) {}
}
export class UnvoteOnSuggestError implements Action {
    readonly type = UNVOTE_ON_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersUnvoteOnSuggest implements Action {
    readonly type = OTHERS_UNVOTE_ON_SUGGEST;
    constructor(public payload: number) {}
}

export const EXPORT_NOTE_AS_BUBBLE = '[Note] export as bubble';
export const EXPORT_NOTE_AS_BUBBLE_PENDING = '[Note] export as bubble pending';
export const EXPORT_NOTE_AS_BUBBLE_COMPLETE = '[Note] export as bubble complete';
export const EXPORT_NOTE_AS_BUBBLE_ERROR = '[Note] export as bubble error';
export const OTHERS_EXPORT_NOTE_AS_BUBBLE = '[Note] others export as bubble';
export class ExportNoteAsBubble implements Action {
    readonly type = EXPORT_NOTE_AS_BUBBLE;
    constructor(public payload: {
        parentId: number,
        loc: number,
        noteId: number}) {}
}
export class ExportNoteAsBubblePending implements Action {
    readonly type = EXPORT_NOTE_AS_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class ExportNoteAsBubbleComplete implements Action {
    readonly type = EXPORT_NOTE_AS_BUBBLE_COMPLETE;
    constructor(public payload: Bubble) {}
}
export class ExportNoteAsBubbleError implements Action {
    readonly type = EXPORT_NOTE_AS_BUBBLE_ERROR;
    constructor(public payload: string) {}
}
export class OthersExportNoteAsBubble implements Action {
    readonly type = OTHERS_EXPORT_NOTE_AS_BUBBLE;
    constructor(public payload: Bubble) {}
}

export const EXPORT_NOTE_AS_SUGGEST = '[Note] export as suggest bubble';
export const EXPORT_NOTE_AS_SUGGEST_PENDING = '[Note] export as suggest bubble pending';
export const EXPORT_NOTE_AS_SUGGEST_COMPLETE = '[Note] export as suggest bubble complete';
export const EXPORT_NOTE_AS_SUGGEST_ERROR = '[Note] export as suggest bubble error';
export const OTHERS_EXPORT_NOTE_AS_SUGGEST = '[Note] others export as suggest bubble';
export class ExportNoteAsSuggest implements Action {
    readonly type = EXPORT_NOTE_AS_SUGGEST;
    constructor(public payload: {
        bindBubbleId: number,
        noteId: number}) {}
}
export class ExportNoteAsSuggestPending implements Action {
    readonly type = EXPORT_NOTE_AS_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class ExportNoteAsSuggestComplete implements Action {
    readonly type = EXPORT_NOTE_AS_SUGGEST_COMPLETE;
    constructor(public payload: SuggestBubble) {}
}
export class ExportNoteAsSuggestError implements Action {
    readonly type = EXPORT_NOTE_AS_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersExportNoteAsSuggest implements Action {
    readonly type = OTHERS_EXPORT_NOTE_AS_SUGGEST;
    constructor(public payload: SuggestBubble) {}
}

export const EXPORT_NOTE_AS_COMMENT_ON_BUBBLE = '[Note] export as comment on bubble';
export const EXPORT_NOTE_AS_COMMENT_ON_BUBBLE_PENDING = '[Note] export as comment on bubble pending';
export const EXPORT_NOTE_AS_COMMENT_ON_BUBBLE_COMPLETE = '[Note] export as comment on bubble complete';
export const EXPORT_NOTE_AS_COMMENT_ON_BUBBLE_ERROR = '[Note] export as comment on bubble error';
export const OTHERS_EXPORT_NOTE_AS_COMMENT_ON_BUBBLE = '[Note] others export as comment on bubble';
export class ExportNoteAsCommentOnBubble implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_BUBBLE;
    constructor(public payload: {
        bindBubbleId: number,
        noteId: number}) {}
}
export class ExportNoteAsCommentOnBubblePending implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_BUBBLE_PENDING;
    constructor(public payload: void) {}
}
export class ExportNoteAsCommentOnBubbleComplete implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_BUBBLE_COMPLETE;
    constructor(public payload: Comment) {}
}
export class ExportNoteAsCommentOnBubbleError implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_BUBBLE_ERROR;
    constructor(public payload: string) {}
}
export class OthersExportNoteAsCommentOnBubble implements Action {
    readonly type = OTHERS_EXPORT_NOTE_AS_COMMENT_ON_BUBBLE;
    constructor(public payload: Comment) {}
}

export const EXPORT_NOTE_AS_COMMENT_ON_SUGGEST = '[Note] export as comment on suggest';
export const EXPORT_NOTE_AS_COMMENT_ON_SUGGEST_PENDING = '[Note] export as comment on suggest pending';
export const EXPORT_NOTE_AS_COMMENT_ON_SUGGEST_COMPLETE = '[Note] export as comment on suggest complete';
export const EXPORT_NOTE_AS_COMMENT_ON_SUGGEST_ERROR = '[Note] export as comment on suggest error';
export const OTHERS_EXPORT_NOTE_AS_COMMENT_ON_SUGGEST = '[Note] others export as comment on suggest';
export class ExportNoteAsCommentOnSuggest implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_SUGGEST;
    constructor(public payload: {
        bindSuggestBubbleId: number,
        noteId: number}) {}
}
export class ExportNoteAsCommentOnSuggestPending implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_SUGGEST_PENDING;
    constructor(public payload: void) {}
}
export class ExportNoteAsCommentOnSuggestComplete implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_SUGGEST_COMPLETE;
    constructor(public payload: Comment) {}
}
export class ExportNoteAsCommentOnSuggestError implements Action {
    readonly type = EXPORT_NOTE_AS_COMMENT_ON_SUGGEST_ERROR;
    constructor(public payload: string) {}
}
export class OthersExportNoteAsCommentOnSuggest implements Action {
    readonly type = OTHERS_EXPORT_NOTE_AS_COMMENT_ON_SUGGEST;
    constructor(public payload: Comment) {}
}

export const ADD_CONTRIBUTER_REQUEST = '[contributer] http request';
export const ADD_CONTRIBUTER_REQUEST_SUCCESS = '[contributer] add http request success';
export const ADD_CONTRIBUTER_REQUEST_FAIL = '[contributer] add http request fail';
export class AddContributerRequest implements Action {
    readonly type = ADD_CONTRIBUTER_REQUEST;
    constructor(public payload: string) {}
}
export class AddContributerRequestSuccess implements Action {
    readonly type = ADD_CONTRIBUTER_REQUEST_SUCCESS;
    constructor(public payload: string) {}
}
export class AddContributerRequestFail implements Action {
    readonly type = ADD_CONTRIBUTER_REQUEST_FAIL;
    constructor(public payload: string) {}
}

export const REFRESH = '[Bubble] refresh';
export class Refresh implements Action {
  readonly type = REFRESH;
  constructor(public payload: void) {}
}

export const CLEAR_ERROR = '[Board] clear error';
export const CLEAR_MSG = '[message] clear';
export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
    constructor(public payload ?: void) {}
}
export class ClearMsg implements Action {
    readonly type = CLEAR_MSG;
    constructor() {}
}

export const EDIT_BUBBLE_OPEN = '[Edit Bubble] Open';
export const EDIT_BUBBLE_CLOSE = '[Edit Bubble] Close';
export class EditBubbleOpen implements Action {
    readonly type = EDIT_BUBBLE_OPEN;
    constructor(public payload: Bubble) {}
}
export class EditBubbleClose implements Action {
    readonly type = EDIT_BUBBLE_CLOSE;
    constructor(public payload: Bubble) {}
}



export type Actions =
  | ChangeTitle
  | ChangeTitlePending
  | ChangeTitleComplete
  | ChangeTitleError
  | OthersChangeTitle
  | TitleReset
  | Open
  | OpenPending
  | OpenComplete
  | OpenError
  | OthersOpenDocument
  | SelectSangjunBoard
  | Close
  | ClosePending
  | CloseComplete
  | CloseError
  | OthersCloseDocument
  | OthersAddedAsContributor
  | Load
  | LoadPending
  | LoadComplete
  | LoadError
  | Select
  | SelectClear
  | MouseOver
  | MouseOut
  | CreateBubble
  | CreateBubblePending
  | CreateBubbleComplete
  | CreateBubbleError
  | OthersCreateBubble
  | CreateSuggestStart
  | CreateSuggest
  | CreateSuggestPending
  | CreateSuggestComplete
  | CreateSuggestError
  | OthersCreateSuggest
  | CreateCommentOnBubble
  | CreateCommentOnBubblePending
  | CreateCommentOnBubbleComplete
  | CreateCommentOnBubbleError
  | OthersCreateCommentOnBubble
  | CreateCommentOnSuggest
  | CreateCommentOnSuggestPending
  | CreateCommentOnSuggestComplete
  | CreateCommentOnSuggestError
  | OthersCreateCommentOnSuggest
  | EditBubble
  | EditBubblePending
  | EditRequestSuccess
  | OthersEditRequest
  | EditUpdate
  | EditUpdateResume
  | EditUpdatePending
  | EditUpdateSuccess
  | OthersEditUpdate
  | EditComplete
  | EditCompletePending
  | EditCompleteSuccess
  | OthersEditComplete
  | EditDiscard
  | EditDiscardPending
  | EditDiscardSuccess
  | OthersEditDiscard
  | EditBubbleError
  | ReleaseOwnership
  | ReleaseOwnershipPending
  | ReleaseOwnershipComplete
  | ReleaseOwnershipError
  | OthersReleaseOwnership
  | EditSuggestFinish
  | EditSuggestDiscard
  | EditSuggestDiscardComplete
  | EditSuggest
  | EditSuggestPending
  | EditSuggestComplete
  | EditSuggestError
  | OthersEditSuggest
  | EditCommentOnBubble
  | EditCommentOnBubblePending
  | EditCommentOnBubbleComplete
  | EditCommentOnBubbleError
  | OthersEditCommentOnBubble
  | EditCommentOnSuggest
  | EditCommentOnSuggestPending
  | EditCommentOnSuggestComplete
  | EditCommentOnSuggestError
  | OthersEditCommentOnSuggest
  | DeleteBubble
  | DeleteBubblePending
  | DeleteBubbleComplete
  | DeleteBubbleError
  | OthersDeleteBubble
  | HideSuggest
  | HideSuggestPending
  | HideSuggestComplete
  | HideSuggestError
  | OthersHideSuggest
  | ShowSuggest
  | ShowSuggestPending
  | ShowSuggestComplete
  | ShowSuggestError
  | OthersShowSuggest
  | DeleteCommentOnBubble
  | DeleteCommentOnBubblePending
  | DeleteCommentOnBubbleComplete
  | DeleteCommentOnBubbleError
  | OthersDeleteCommentOnBubble
  | DeleteCommentOnSuggest
  | DeleteCommentOnSuggestPending
  | DeleteCommentOnSuggestComplete
  | DeleteCommentOnSuggestError
  | OthersDeleteCommentOnSuggest
  | MoveBubbleStart
  | MoveBubble
  | MoveBubblePending
  | MoveBubbleComplete
  | MoveBubbleError
  | OthersMoveBubble
  | WrapStart
  | WrapBubble
  | WrapBubblePending
  | WrapBubbleComplete
  | WrapBubbleError
  | OthersWrapBubble
  | PopBubble
  | PopBubblePending
  | PopBubbleComplete
  | PopBubbleError
  | OthersPopBubble
  | SplitInternalStart
  | SplitInternal
  | SplitInternalPending
  | SplitInternalComplete
  | SplitInternalError
  | OthersSplitInternal
  | SplitLeafStart
  | SplitLeaf
  | SplitLeafPending
  | SplitLeafComplete
  | SplitLeafError
  | OthersSplitLeaf
  | MergeStart
  | MergeBubble
  | MergeBubblePending
  | MergeBubbleComplete
  | MergeBubbleError
  | OthersMergeBubble
  | FlattenBubble
  | FlattenBubblePending
  | FlattenBubbleComplete
  | FlattenBubbleError
  | OthersFlattenBubble
  | SwitchBubble
  | SwitchBubblePending
  | SwitchBubbleComplete
  | SwitchBubbleError
  | OthersSwitchBubble
  | VoteOnSuggest
  | VoteOnSuggestPending
  | VoteOnSuggestComplete
  | VoteOnSuggestError
  | OthersVoteOnSuggest
  | UnvoteOnSuggest
  | UnvoteOnSuggestPending
  | UnvoteOnSuggestComplete
  | UnvoteOnSuggestError
  | OthersUnvoteOnSuggest
  | ExportNoteAsBubble
  | ExportNoteAsBubblePending
  | ExportNoteAsBubbleComplete
  | ExportNoteAsBubbleError
  | OthersExportNoteAsBubble
  | ExportNoteAsSuggest
  | ExportNoteAsSuggestPending
  | ExportNoteAsSuggestComplete
  | ExportNoteAsSuggestError
  | OthersExportNoteAsSuggest
  | ExportNoteAsCommentOnBubble
  | ExportNoteAsCommentOnBubblePending
  | ExportNoteAsCommentOnBubbleComplete
  | ExportNoteAsCommentOnBubbleError
  | OthersExportNoteAsCommentOnBubble
  | ExportNoteAsCommentOnSuggest
  | ExportNoteAsCommentOnSuggestPending
  | ExportNoteAsCommentOnSuggestComplete
  | ExportNoteAsCommentOnSuggestError
  | OthersExportNoteAsCommentOnSuggest
  | Refresh
  | ClearError
  | ClearMsg
  | AddContributerRequest
  | AddContributerRequestSuccess
  | AddContributerRequestFail


  // UI
  | EditBubbleOpen
  | EditBubbleClose;
