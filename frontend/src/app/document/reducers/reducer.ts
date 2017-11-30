import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BubbleReducer, BubbleState } from './bubble-reducer';
import * as fromRoot from '../../shared/reducer';


export interface State extends fromRoot.State {
    'bubble': BubbleState;
}
export { BubbleReducer };

export const getBubbleState = createFeatureSelector<BubbleState>('bubble');

export const getBubbleList = createSelector(getBubbleState, (state: BubbleState) => state.bubbleList);
export const getSelectedBubble = createSelector(getBubbleState, (state: BubbleState) => state.selectedBubble);
