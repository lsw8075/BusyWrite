import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../index';

import * as BUBBLE from '../actions/bubble.action';

export interface BubbleState {
  rootBubble: InternalBubble;
  bubbleList: Bubble[];
  selectedBubble: Bubble;
  loading: boolean;
  error: string;
}

const initialState: BubbleState = {
  rootBubble: null,
  bubbleList: [],
  selectedBubble: null,
  loading: false,
  error: ''
};

export function BubbleReducer(state: BubbleState = initialState, action: BUBBLE.Actions) {
  switch (action.type) {
    case BUBBLE.SELECT:
      return {...state, selectedBubble: action.payload};
    case BUBBLE.LOAD_COMPLETE:
      return {...state, rootBubble: action.payload};
    default:
      return state;
  }
}

export const getRootBubble = (state: BubbleState) => {
  console.log(state);
  return state.rootBubble; };
export const getBubbleList = (state: BubbleState) => state.bubbleList;
