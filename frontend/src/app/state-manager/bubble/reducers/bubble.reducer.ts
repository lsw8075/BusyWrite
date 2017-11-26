import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble, MenuType } from '../index';

import * as BUBBLE from '../actions/bubble.action';

export interface BubbleState {
  rootBubble: InternalBubble;
  bubbleList: Bubble[];
  selectedBubble: Bubble;
  selectedMenu: MenuType;
  loading: boolean;
  error: string;
}

const initialState: BubbleState = {
  rootBubble: null,
  bubbleList: [],
  selectedBubble: null,
  selectedMenu: null,
  loading: false,
  error: ''
};

export function BubbleReducer(state: BubbleState = initialState, action: BUBBLE.Actions) {
  switch (action.type) {
    case BUBBLE.SELECT:
      return {...state, selectedBubble: action.payload.bubble, selectedMenu: action.payload.menu};
    case BUBBLE.LOAD:
      return {...state, loading: true};
    case BUBBLE.LOAD_COMPLETE:
      return {...state, rootBubble: action.payload, loading: false};
    case BUBBLE.LOAD_ERROR:
      return {...state, error: action.payload};
    default:
      return state;
  }
}

export const getRootBubble = (state: BubbleState) => state.rootBubble;
export const getBubbleList = (state: BubbleState) => state.bubbleList;
