import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BubbleReducer, BubbleState } from './bubble-reducer';
import { BoardReducer, BoardState } from './board-reducer';

import * as fromRoot from '../../shared/reducer';
import { Board, BoardType, BoardLocation } from '../models/board';
import { Bubble, InternalBubble } from '../models/bubble';


export interface State extends fromRoot.State {
    bubble: BubbleState;
    board: BoardState;
}
export const reducer = {
    bubble: BubbleReducer,
    board: BoardReducer,
};

export const getDocumentState = createFeatureSelector<State>('document');

export const getBubbleState = createSelector(getDocumentState, (state: State) => state.bubble);

export const getBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.bubbleList);
export const getRootBubble = createSelector(getBubbleList, (bubbleList: Bubble[]) => (bubbleList[0] as InternalBubble));

export const getSelectedMenu = createSelector(getBubbleState, (state: BubbleState) => state.selectedMenu);
export const getSelectedBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.selectedBubbleList);
export const getHoverBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.hoverBubbleList);
export const getBubbleStateError = createSelector(getBubbleState, (state: BubbleState) => state.error);
export const getSangjunBubble = createSelector(getBubbleState, (state: BubbleState) => state.sangjunBoardBubble);

export const getBoardState = createSelector(getDocumentState, (state: State) => state.board);
export const getBoardList = createSelector(getBoardState, (state: BoardState) => state.boardList);
export const getLeftBoard = createSelector(getBoardList,
    (state: Board[]) => state.find(board => board.location === BoardLocation.left));
export const getRightBoard = createSelector(getBoardList,
    (state: Board[]) => state.find(board => board.location === BoardLocation.right));

export const getBoardStateError = createSelector(getBoardState, (state: BoardState) => state.error);
export const getActiveBoard = createSelector(getBoardState, (state: BoardState) => state.activeBoard);
