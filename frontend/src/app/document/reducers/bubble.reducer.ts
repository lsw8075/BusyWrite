import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble, MenuType } from '../index';

import * as fromBubble from '../actions/bubble.action';

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

export function BubbleReducer(state: BubbleState = initialState, action: fromBubble.Actions) {
  switch (action.type) {
    case fromBubble.SELECT:
      return {...state, selectedBubble: action.payload.bubble, selectedMenu: action.payload.menu};
    case fromBubble.LOAD:
      return {...state, loading: true};
    case fromBubble.LOAD_COMPLETE:
      return {...state, rootBubble: action.payload, loading: false};
    case fromBubble.LOAD_ERROR:
      return {...state, error: action.payload};
    case fromBubble.POP:
      return {...state, loading: true};
    case fromBubble.POP_COMPLETE:
    {
      const bubble = action.payload;
      const parentBubble: InternalBubble = bubble.parentBubble;
      parentBubble.popChild(bubble);
      state.bubbleList = state.bubbleList.filter(b => b.id !== bubble.id);
      return {...state, loading: false};
    }
    default:
      return state;
  }
}

export const getRootBubble = (state: BubbleState) => state.rootBubble;
export const getBubbleList = (state: BubbleState) => state.bubbleList;
