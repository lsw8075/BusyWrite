import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';

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
      const selection = action.payload as {bubble: Bubble, menu: MenuType};
      return {...state, selectedBubble: selection.bubble, selectedMenu: selection.menu};
    case fromBubble.LOAD:
      return {...state, loading: true};
    case fromBubble.LOAD_COMPLETE:
      return {...state, rootBubble: action.payload, loading: false};
    case fromBubble.LOAD_ERROR:
      return {...state, error: action.payload};
    case fromBubble.POP:
      return {...state, loading: true};
    case fromBubble.POP_COMPLETE: {
      const bubble = action.payload;
      const parentBubble: InternalBubble = bubble.parentBubble;
      parentBubble.popChild(bubble);
      state.bubbleList = state.bubbleList.filter(b => b.id !== bubble.id);
      return {...state, loading: false};
    }
    case fromBubble.DELETE:
      return {...state, loading: true};
    case fromBubble.DELETE_COMPLETE: {
      const bubble = action.payload;
      deleteBubble(bubble);
      return {...state, loading: false};
    }
    case fromBubble.CREATE:
      return {...state, selectedBubble: action.payload.bubble, selectedMenu: action.payload.menu, loading: true};
    case fromBubble.CREATE_COMPLETE: {
      const bubble = action.payload.bubble;
      const menu = action.payload.menu;
      createBubble(bubble, menu);
      return {...state, selectedBubble: bubble, selectedMenu: menu, loading: false};
    }
    case fromBubble.EDIT:
      return {...state, loading: true};
    case fromBubble.EDIT_COMPLETE: {
      const bubble = action.payload;
      return {...state, loading: false};
    }
    default:
      return state;
  }
}

function _containsBubble(bubble: Bubble, bubbleList: Array<Bubble>): boolean {
  for (const b of this.bubbleList) {
    if (b.id === bubble.id) {
      return true;
    }
  }
  return false;
}

function deleteBubble(bubble: Bubble) {
  if (bubble.parentBubble === null) {
    throw new Error('Cannot delete root bubble');
  }

  const parentBubble: InternalBubble = bubble.parentBubble;
  parentBubble.deleteChild(bubble);

  if (parentBubble.childBubbles.length === 1) {
    const grandParentBubble: InternalBubble = parentBubble.parentBubble;
    grandParentBubble.popChild(parentBubble);
  }
}

function createBubble(bubble: Bubble, menu: MenuType) {
  let location = bubble.location;
  if (menu === MenuType.borderBottomMenu) {
    location++;
  } else if (menu !== MenuType.borderTopMenu) {
    throw new Error('create bubble invoked with not border');
  }

}

function editBubble(bubble: Bubble, newContent: string) {
  if (bubble.type === BubbleType.leafBubble) {
//    (bubble as LeafBubble).getEditLock(tempUserId);
    (bubble as LeafBubble).content = newContent;
  } else {
    throw new Error('Cannot edit internal bubble');
  }
}

export const getRootBubble = (state: BubbleState) => state.rootBubble;
export const getBubbleList = (state: BubbleState) => state.bubbleList;
