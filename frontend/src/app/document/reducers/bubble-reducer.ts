import { Action } from '@ngrx/store';

import { BubbleTemp, BubbleType, InternalBubbleTemp, LeafBubble } from '../models/bubble-temp';
import { MenuType } from '../services/event/event-bubble.service';
import { MockBubbleRoot } from '../models/bubble.mock';

import * as fromBubble from '../actions/bubble-action';

export interface BubbleState {
  documentId: number;
  rootBubble: InternalBubbleTemp;
  bubbleList: BubbleTemp[];
  selectedBubble: BubbleTemp;
  selectedMenu: MenuType;
  loading: boolean;
  error: string;
}

const initialState: BubbleState = {
  documentId: -1,
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
      const selection = action.payload as {bubble: BubbleTemp, menu: MenuType};
      return {...state, selectedBubble: selection.bubble, selectedMenu: selection.menu};
    case fromBubble.LOAD:
      return {...state, loading: true, documentId: action.payload};
    case fromBubble.LOAD_COMPLETE: {
      const root = MockBubbleRoot;
      return {...state, bubbleList: action.payload, rootBubble: root, loading: false};
    }
    case fromBubble.LOAD_ERROR:
      return {...state, error: action.payload};
    case fromBubble.POP:
      return {...state, loading: true};
    case fromBubble.POP_COMPLETE: {
      const bubble = action.payload;
      const parentBubble: InternalBubbleTemp = bubble.parentBubble;
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
    case fromBubble.WRAP:
      return {...state, loading: true};
    case fromBubble.WRAP_COMPLETE: {
      const bubble = action.payload;
      return {...state, loading: false};
    }
    case fromBubble.MERGE:
      return {...state, loading: true};
    case fromBubble.MERGE_COMPLETE: {
      const bubble = action.payload;
      return {...state, loading: false};
    }
    case fromBubble.SPLIT:
      return {...state, loading: true};
    case fromBubble.SPLIT_COMPLETE: {
      const bubble = action.payload;
      return {...state, loading: false};
    }
    default:
      return state;
  }
}

function _containsBubble(bubble: BubbleTemp, bubbleList: Array<BubbleTemp>): boolean {
  for (const b of this.bubbleList) {
    if (b.id === bubble.id) {
      return true;
    }
  }
  return false;
}

function getBubbleById(bubbleList: Array<BubbleTemp>, id: number): BubbleTemp {
  const bList = bubbleList.filter((bubble) => (bubble.id === id));
  if (bList.length === 0) {
    throw new Error('Does not exist with this id');
  }
  return bList[0];
}

function deleteBubble(bubble: BubbleTemp) {
  if (bubble.parentBubble === null) {
    throw new Error('Cannot delete root bubble');
  }

  const parentBubble: InternalBubbleTemp = bubble.parentBubble;
  parentBubble.deleteChild(bubble);

  if (parentBubble.childBubbles.length === 1) {
    const grandParentBubble: InternalBubbleTemp = parentBubble.parentBubble;
    grandParentBubble.popChild(parentBubble);
  }
}

function createBubble(bubble: BubbleTemp, menu: MenuType) {
  let location = bubble.location;
  if (menu === MenuType.borderBottomMenu) {
    location++;
  } else if (menu !== MenuType.borderTopMenu) {
    throw new Error('create bubble invoked with not border');
  }

}

function editBubble(bubble: BubbleTemp, newContent: string) {
  if (bubble.type === BubbleType.leafBubble) {
//    (bubble as LeafBubble).getEditLock(tempUserId);
    (bubble as LeafBubble).content = newContent;
  } else {
    throw new Error('Cannot edit internal bubble');
  }
}

function wrapBubble(wrapBubbleList: Array<BubbleTemp>): Promise<void> {
  if (wrapBubbleList.length > 1) {
    const parentBubble: InternalBubbleTemp = wrapBubbleList[0].parentBubble;
    const wrapperBubble = new InternalBubbleTemp(this._getId(), null);
    parentBubble.wrapChildren(wrapperBubble, wrapBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, wrapBubbleList));
    this.bubbleList.push(wrapperBubble);
  }
  return Promise.resolve(null);
}

export const getRootBubble = (state: BubbleState) => state.rootBubble;
export const getBubbleList = (state: BubbleState) => state.bubbleList;
