import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BubbleReducer, BubbleState } from './bubble-reducer';
import * as fromRoot from '../../shared/reducer';


export interface State extends fromRoot.State {
    'bubble': BubbleState;
}
export { BubbleReducer };

export const getBubbleState = createFeatureSelector<BubbleState>('bubble');

export const getRootBubble = createSelector(getBubbleState, (state: BubbleState) => state.rootBubble);
export const getBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.bubbleList);
export const getSelectedMenu = createSelector(getBubbleState, (state: BubbleState) => state.selectedMenu);
export const getSelectedBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.selectedBubbleList);
export const getHoverBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.hoverBubbleList);
