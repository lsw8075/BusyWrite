import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BubbleReducer, BubbleState } from './bubble-reducer';
import { BoardReducer, BoardState } from './board-reducer';
import { SangjunBubbleReducer, SangjunBubbleState } from './sangjun-bubble-reducer';
import { UserState } from '../../user/reducers/user-reducer';

import * as fromRoot from '../../shared/reducer';
import { Board, BoardType, BoardLocation } from '../models/board';
import { Bubble, InternalBubble, BubbleType, LeafBubble } from '../models/bubble';
import { Document } from '../../file/models/document';
import { User } from '../../user/models/user';

export interface State extends fromRoot.State {
    bubble: BubbleState;
    board: BoardState;
    sangjun: SangjunBubbleState;
}
export const reducer = {
    bubble: BubbleReducer,
    board: BoardReducer,
    sangjun: SangjunBubbleReducer,
};

export const getDocumentState = createFeatureSelector<State>('document');

// board
export const getBoardState = createSelector(getDocumentState, (state: State) => state.board);
export const getBoardList = createSelector(getBoardState, (state: BoardState) => state.boardList);
export const getLeftBoard = createSelector(getBoardList,
    (state: Board[]) => state.find(board => board.location === BoardLocation.left));
export const getRightBoard = createSelector(getBoardList,
    (state: Board[]) => state.find(board => board.location === BoardLocation.right));
export const getBoardStateError = createSelector(getBoardState, (state: BoardState) => state.error);
export const getActiveBoard = createSelector(getBoardState, (state: BoardState) => state.activeBoard);

// bubble
export const getBubbleState = createSelector(getDocumentState, (state: State) => state.bubble);

export const getBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.bubbleList);
export const getRootBubble = createSelector(getBubbleList, (bubbleList: Bubble[]) => (bubbleList[0] as InternalBubble));

export const getSelectedMenu = createSelector(getBubbleState, (state: BubbleState) => state.selectedMenu);
export const getSelectedBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.selectedBubbleList);
export const getHoverBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.hoverBubbleList);
export const getBubbleStateError = createSelector(getBubbleState, (state: BubbleState) => state.error);
export const getBubbleStateMsg = createSelector(getBubbleState, (state: BubbleState) => state.msg);

export const getViewBoardMenuState = createSelector(getBubbleState, (state: BubbleState) => state.viewBoardMenuType);

export const isLoading = createSelector(getBubbleState, (state: BubbleState) => state.loading);

export const getDocumentObject = createSelector(getBubbleState, (state: BubbleState) => state.documentObject);
export const getDocumentTitle = createSelector(getDocumentObject, (state: Document) => {
    if (state) {
        return state.title;
    } else {
        return 'title is loading';
    }
});
export const getDocumentContributers = createSelector(getDocumentObject, (state: Document) => {
    if (state) {
        return state.contributors;
    } else {
        return [];
    }
});
export const getDocumentConnectors = createSelector(getBubbleState, (state: BubbleState) => state.connectors);

// suggest bubble
export const getSangjunBoardState = createSelector(getDocumentState, (state: State) => state.sangjun);
export const getSangjunBubble = createSelector(getSangjunBoardState, (state: SangjunBubbleState) => state.bubble);
export const getSuggestBubbles = createSelector(getBubbleState, (state: BubbleState) => state.suggestBubbleList);
export const getComments = createSelector(getBubbleState, (state: BubbleState) => state.commentList);

// notes
export const getNotes= createSelector(getBubbleState, (state: BubbleState) => state.noteList);

// edit board
export const getUserState = createFeatureSelector<State>('user');

export const getUserId = createSelector(fromRoot.getUserState, (state: UserState) => state.userId);

export const getEditBubbles = createSelector(getBubbleList, getUserId, (state: Bubble[], userId: number) =>
    state.filter(b => b.type === BubbleType.leafBubble).filter(b => (userId !== -1) && (b as LeafBubble).editLockHolder === userId));
