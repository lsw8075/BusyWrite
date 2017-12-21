import * as Action from './bubble-action';
import { Bubble, InternalBubble, LeafBubble, SuggestBubble, Suggest } from '../models/bubble';
import { Comment } from '../models/comment';
import { Note } from '../models/note';
import { User } from '../../user/models/user';
import { Document } from '../../file/models/document';
import { MenuType } from '../services/event/event-bubble.service';


describe('bubble action', () => {
    it('Title', () => {
        const changeTitle = new Action.ChangeTitle('');
        expect(changeTitle.type).toBe(Action.CHANGE_TITLE);

        const changeTitlePending = new Action.ChangeTitlePending(null);
        expect(changeTitlePending.type).toBe(Action.CHANGE_TITLE_PENDING);

        const changeTitleComplete = new Action.ChangeTitleComplete('complete');
        expect(changeTitleComplete.type).toBe(Action.CHANGE_TITLE_COMPLETE);

        const changeTitleError = new Action.ChangeTitleError('error');
        expect(changeTitleError.type).toBe(Action.CHANGE_TITLE_ERROR);

        const othersChangeTitle = new Action.OthersChangeTitle('hi');
        expect(othersChangeTitle.type).toBe(Action.OTHERS_CHANGE_TITLE);

        const titleReset = new Action.TitleReset();
        expect(titleReset.type).toBe(Action.TITLE_RESET);
    });

    it('OPEN', () => {
        const open = new Action.Open();
        expect(open.type).toBe(Action.OPEN);

        const openPending = new Action.OpenPending(null);
        expect(openPending.type).toBe(Action.OPEN_PENDING);

        const openComplete = new Action.OpenComplete({
            documentObject: new Document(1, 'title'),
            connectors: [new User(1, 'username', 'string')]
        });
        expect(openComplete.type).toBe(Action.OPEN_COMPLETE);

        const openError = new Action.OpenError('err');
        expect(openError.type).toBe(Action.OPEN_ERROR);

        const othersOpenDocument = new Action.OthersOpenDocument(1);
        expect(othersOpenDocument.type).toBe(Action.OTHERS_OPEN_DOCUMENT);
    });

    it('select sangjun board', () => {
        const selectSangjunBoard = new Action.SelectSangjunBoard(new LeafBubble(1));
        expect(selectSangjunBoard.type).toBe(Action.SELECT_SANGJUN_BOARD);
    });

    it('close', () => {
        const close = new Action.Close('');
        expect(close.type).toBe(Action.CLOSE);

        const closePending = new Action.ClosePending(null);
        expect(closePending.type).toBe(Action.CLOSE_PENDING);

        const closeComplete = new Action.CloseComplete(null);
        expect(closeComplete.type).toBe(Action.CLOSE_COMPLETE);

        const closeError = new Action.CloseError('error');
        expect(closeError.type).toBe(Action.CLOSE_ERROR);

        const othersChangeDocument = new Action.OthersCloseDocument(1);
        expect(othersChangeDocument.type).toBe(Action.OTHERS_CLOSE_DOCUMENT);
    });

    it('others added as contributer', () => {
        const others = new Action.OthersAddedAsContributor(new User(1, '', ''));
        expect(others.type).toBe(Action.OTHERS_ADDED_AS_CONTRIBUTOR);
    });

    it('load', () => {
        const load = new Action.Load(1);
        expect(load.type).toBe(Action.LOAD);

        const loadPending = new Action.LoadPending(null);
        expect(loadPending.type).toBe(Action.LOAD_PENDING);

        const loadComplete = new Action.LoadComplete(null);
        expect(loadComplete.type).toBe(Action.LOAD_COMPLETE);

        const loadError = new Action.LoadError('error');
        expect(loadError.type).toBe(Action.LOAD_ERROR);
    });

    it('select suggest bubble', () => {
        const selectSuggestBubble = new Action.SelectSuggestBubble(new SuggestBubble(1, '', 1));
        expect(selectSuggestBubble.type).toBe(Action.SELECT_SUGGEST_BUBBLE);

        const selectSuggestBubbleClear = new Action.SelectSuggestBubbleClear(null);
        expect(selectSuggestBubbleClear.type).toBe(Action.SELECT_SUGGEST_BUBBLE_CLEAR);
    });

    it('select hover', () => {
        const select = new Action.Select({
            bubble: new LeafBubble(1),
            menu: MenuType.borderBottomMenu
        });
        expect(select.type).toBe(Action.SELECT);

        const selectClear = new Action.SelectClear();
        expect(selectClear.type).toBe(Action.SELECT_CLEAR);

        const mouseOver = new Action.MouseOver(new LeafBubble(1));
        expect(mouseOver.type).toBe(Action.MOUSE_OVER);

        const mouseOut = new Action.MouseOut(new LeafBubble(1));
        expect(mouseOut.type).toBe(Action.MOUSE_OUT);
    });

    it('create', () => {
        const create = new Action.CreateBubble({
            bubbleId: 1,
            isAbove: false
        });
        expect(create.type).toBe(Action.CREATE_BUBBLE);

        const createPending = new Action.CreateBubblePending(null);
        expect(createPending.type).toBe(Action.CREATE_BUBBLE_PENDING);

        const createComplete = new Action.CreateBubbleComplete(null);
        expect(createComplete.type).toBe(Action.CREATE_BUBBLE_COMPLETE);

        const createError = new Action.CreateBubbleError('error');
        expect(createError.type).toBe(Action.CREATE_BUBBLE_ERROR);

        const othersCreateBubble = new Action.OthersCreateBubble(new LeafBubble(1));
        expect(othersCreateBubble.type).toBe(Action.OTHERS_CREATE_BUBBLE);
    });

    it('create suggest', () => {
        const createStart = new Action.CreateSuggestStart(new Suggest());
        expect(createStart.type).toBe(Action.CREATE_SUGGEST_START);

        const create = new Action.CreateSuggest(new Suggest());
        expect(create.type).toBe(Action.CREATE_SUGGEST);

        const createPending = new Action.CreateSuggestPending(null);
        expect(createPending.type).toBe(Action.CREATE_SUGGEST_PENDING);

        const createComplete = new Action.CreateSuggestComplete(null);
        expect(createComplete.type).toBe(Action.CREATE_SUGGEST_COMPLETE);

        const createError = new Action.CreateSuggestError('error');
        expect(createError.type).toBe(Action.CREATE_SUGGEST_ERROR);

        const othersCreateSuggest = new Action.OthersCreateSuggest(new SuggestBubble(1, '', 1));
        expect(othersCreateSuggest.type).toBe(Action.OTHERS_CREATE_SUGGEST);
    });

    it('create comment on bubble', () => {

        const create = new Action.CreateCommentOnBubble({
            bindBubbleId: 1, content: ''
        });
        expect(create.type).toBe(Action.CREATE_COMMENT_ON_BUBBLE);

        const createPending = new Action.CreateCommentOnBubblePending(null);
        expect(createPending.type).toBe(Action.CREATE_COMMENT_ON_BUBBLE_PENDING);

        const createComplete = new Action.CreateCommentOnBubbleComplete(null);
        expect(createComplete.type).toBe(Action.CREATE_COMMENT_ON_BUBBLE_COMPLETE);

        const createError = new Action.CreateCommentOnBubbleError('error');
        expect(createError.type).toBe(Action.CREATE_COMMENT_ON_BUBBLE_ERROR);

        const othersCreateCommentOnBubble = new Action.OthersCreateCommentOnBubble(new Comment(1, '', 1, 1, 1));
        expect(othersCreateCommentOnBubble.type).toBe(Action.OTHERS_CREATE_COMMENT_ON_BUBBLE);
    });

    it('create comment on suggest', () => {

        const create = new Action.CreateCommentOnSuggest({
            bindSuggestBubbleId: 1, content: ''
        });
        expect(create.type).toBe(Action.CREATE_COMMENT_ON_SUGGEST);

        const createPending = new Action.CreateCommentOnSuggestPending(null);
        expect(createPending.type).toBe(Action.CREATE_COMMENT_ON_SUGGEST_PENDING);

        const createComplete = new Action.CreateCommentOnSuggestComplete(null);
        expect(createComplete.type).toBe(Action.CREATE_COMMENT_ON_SUGGEST_COMPLETE);

        const createError = new Action.CreateCommentOnSuggestError('error');
        expect(createError.type).toBe(Action.CREATE_COMMENT_ON_SUGGEST_ERROR);

        const othersCreateCommentOnSuggest = new Action.OthersCreateCommentOnSuggest(new Comment(1, '', 1, 1, 1));
        expect(othersCreateCommentOnSuggest.type).toBe(Action.OTHERS_CREATE_COMMENT_ON_SUGGEST);
    });

    it('edit', () => {
        const edit = new Action.EditBubble(1);
        expect(edit.type).toBe(Action.EDIT_BUBBLE);

        const editPending = new Action.EditBubblePending(null);
        expect(editPending.type).toBe(Action.EDIT_BUBBLE_PENDING);

        const editComplete = new Action.EditRequestSuccess(null);
        expect(editComplete.type).toBe(Action.EDIT_REQUEST_SUCCESS);

        const editError = new Action.EditBubbleError('error');
        expect(editError.type).toBe(Action.EDIT_BUBBLE_ERROR);

        const othersEditBubble = new Action.OthersEditRequest({
            bubbleId: 1, userId: 1
        });
        expect(othersEditBubble.type).toBe(Action.OTHERS_EDIT_REQUEST);
    });

    it('editUpdate', () => {
        const editUpdate = new Action.EditUpdate({
            bubbleId: 1, content: ''
        });
        expect(editUpdate.type).toBe(Action.EDIT_UPDATE);

        const editUpdatePending = new Action.EditUpdatePending(null);
        expect(editUpdatePending.type).toBe(Action.EDIT_UPDATE_PENDING);

        const editUpdateComplete = new Action.EditUpdateSuccess(null);
        expect(editUpdateComplete.type).toBe(Action.EDIT_UPDATE_SUCCESS);
    });



    it('editSuggest', () => {
        const editSuggest = new Action.EditSuggest(null);
        expect(editSuggest.type).toBe(Action.EDIT_SUGGEST);

        const editSuggestPending = new Action.EditSuggestPending(null);
        expect(editSuggestPending.type).toBe(Action.EDIT_SUGGEST_PENDING);

        const editSuggestComplete = new Action.EditRequestSuccess(null);
        expect(editSuggestComplete.type).toBe(Action.EDIT_REQUEST_SUCCESS);

        const editSuggestError = new Action.EditSuggestError(null);
        expect(editSuggestError.type).toBe(Action.EDIT_SUGGEST_ERROR);

        const othersEditSuggest = new Action.OthersEditSuggest(null);
        expect(othersEditSuggest.type).toBe(Action.OTHERS_EDIT_SUGGEST);
    });

    it('editComment', () => {
        const editComment = new Action.EditCommentOnBubble(null);
        expect(editComment.type).toBe(Action.EDIT_COMMENT_ON_BUBBLE);

        const editCommentPending = new Action.EditCommentOnBubblePending(null);
        expect(editCommentPending.type).toBe(Action.EDIT_COMMENT_ON_BUBBLE_PENDING);

        const editCommentComplete = new Action.EditRequestSuccess(null);
        expect(editCommentComplete.type).toBe(Action.EDIT_REQUEST_SUCCESS);

        const editCommentError = new Action.EditCommentOnBubbleError(null);
        expect(editCommentError.type).toBe(Action.EDIT_COMMENT_ON_BUBBLE_ERROR);

        const othersEditCommentOnBubble = new Action.OthersEditCommentOnBubble(null);
        expect(othersEditCommentOnBubble.type).toBe(Action.OTHERS_EDIT_COMMENT_ON_BUBBLE);
    });

    it('editComment on suggest', () => {
        const editComment = new Action.EditCommentOnSuggest(null);
        expect(editComment.type).toBe(Action.EDIT_COMMENT_ON_SUGGEST);

        const editCommentPending = new Action.EditCommentOnSuggestPending(null);
        expect(editCommentPending.type).toBe(Action.EDIT_COMMENT_ON_SUGGEST_PENDING);

        const editCommentComplete = new Action.EditRequestSuccess(null);
        expect(editCommentComplete.type).toBe(Action.EDIT_REQUEST_SUCCESS);

        const editCommentError = new Action.EditCommentOnSuggestError(null);
        expect(editCommentError.type).toBe(Action.EDIT_COMMENT_ON_SUGGEST_ERROR);

        const othersEditCommentOnSuggest = new Action.OthersEditCommentOnSuggest(null);
        expect(othersEditCommentOnSuggest.type).toBe(Action.OTHERS_EDIT_COMMENT_ON_SUGGEST);
    });

    it('deleteBubble', () => {
        const deleteBubble = new Action.DeleteBubble(null);
        expect(deleteBubble.type).toBe(Action.DELETE_BUBBLE);

        const deleteBubblePending = new Action.DeleteBubblePending(null);
        expect(deleteBubblePending.type).toBe(Action.DELETE_BUBBLE_PENDING);

        const deleteBubbleComplete = new Action.DeleteBubbleComplete(null);
        expect(deleteBubbleComplete.type).toBe(Action.DELETE_BUBBLE_COMPLETE);

        const deleteBubbleError = new Action.DeleteBubbleError(null);
        expect(deleteBubbleError.type).toBe(Action.DELETE_BUBBLE_ERROR);

        const othersDeleteBubble = new Action.OthersDeleteBubble(null);
        expect(othersDeleteBubble.type).toBe(Action.OTHERS_DELETE_BUBBLE);
    });

    it('hideSuggest', () => {
        const hideSuggest = new Action.HideSuggest(null);
        expect(hideSuggest.type).toBe(Action.HIDE_SUGGEST);

        const hideSuggestPending = new Action.HideSuggestPending(null);
        expect(hideSuggestPending.type).toBe(Action.HIDE_SUGGEST_PENDING);

        const hideSuggestComplete = new Action.HideSuggestComplete(null);
        expect(hideSuggestComplete.type).toBe(Action.HIDE_SUGGEST_COMPLETE);

        const hideSuggestError = new Action.HideSuggestError(null);
        expect(hideSuggestError.type).toBe(Action.HIDE_SUGGEST_ERROR);

        const othersHideSuggest = new Action.OthersHideSuggest(null);
        expect(othersHideSuggest.type).toBe(Action.OTHERS_HIDE_SUGGEST);
    });

    it('showSuggest', () => {
        const showSuggest = new Action.ShowSuggest(null);
        expect(showSuggest.type).toBe(Action.SHOW_SUGGEST);

        const showSuggestPending = new Action.ShowSuggestPending(null);
        expect(showSuggestPending.type).toBe(Action.SHOW_SUGGEST_PENDING);

        const showSuggestComplete = new Action.ShowSuggestComplete(null);
        expect(showSuggestComplete.type).toBe(Action.SHOW_SUGGEST_COMPLETE);

        const showSuggestError = new Action.ShowSuggestError(null);
        expect(showSuggestError.type).toBe(Action.SHOW_SUGGEST_ERROR);

        const othersShowSuggest = new Action.OthersShowSuggest(null);
        expect(othersShowSuggest.type).toBe(Action.OTHERS_SHOW_SUGGEST);
    });

});
