import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';
import { MockBubbleRoot } from '../models/bubble.mock';

import * as fromBubble from '../actions/bubble-action';

export interface BubbleState {
  documentId: number;
  rootBubble: InternalBubble;
  bubbleList: Bubble[];
  selectedBubble: Bubble;
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
      const selection = action.payload as {bubble: Bubble, menu: MenuType};
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
      return {...state, loading: false};
    }
    case fromBubble.DELETE:
      return {...state, loading: true};
    case fromBubble.DELETE_COMPLETE: {
      const bubble = action.payload;
      deleteBubble(state.bubbleList, bubble.id);
      return {
          ...state,
          loading: false,
          bubbleList: [
              ...state.bubbleList
          ]
          };
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

function BubbleListReducer(state, action) {
    // nested reducer
}

function _containsBubble(bubble: Bubble, bubbleList: Array<Bubble>): boolean {
  for (const b of this.bubbleList) {
    if (b.id === bubble.id) {
      return true;
    }
  }
  return false;
}

function getBubbleById(bubbleList: Array<Bubble>, id: number): Bubble {
  const bList = bubbleList.filter((bubble) => (bubble.id === id));
  if (bList.length === 0) {
    throw new Error('Does not exist with this id');
  }
  return bList[0];
}

function removeBubbleById(bubbleList: Array<Bubble>, id: number): void {
  const index = bubbleList.findIndex((bubble) => (bubble.id === id));
  if (index === -1) {
    throw new Error('Does not exist with this id');
  }
  bubbleList.splice(index, 1);
}

function getParentBubble(bubbleList: Array<Bubble>, bubble: Bubble): InternalBubble {
  try {
    const parentBubble = getBubbleById(bubbleList, bubble.parentBubbleId);
    return parentBubble as InternalBubble;
  } catch(err) {
    throw new Error('Does not exist parent bubble');
  }
}

function deleteChildBubbles(bubbleList: Array<Bubble>, id: number) {
  try {
    const bubble = getBubbleById(bubbleList, id);
    if (bubble.type === BubbleType.internalBubble) {
      const internalBubble = bubble as InternalBubble;
      for (const childBubbleId of internalBubble.childBubbleIds) {
        deleteChildBubbles(bubbleList, childBubbleId);
      }
    }
    removeBubbleById(bubbleList, bubble.id);
  } catch (err) {
  //  throw err;
  }
}

function deleteBubble(bubbleList: Array<Bubble>, id: number) {
  try {
    const bubble = getBubbleById(bubbleList, id);
    const parentBubble = getParentBubble(bubbleList, bubble);

    deleteChildBubbles(bubbleList, id);
    console.log(parentBubble.childBubbleIds);
    parentBubble.childBubbleIds.splice(bubble.location, 1);
    console.log(parentBubble.childBubbleIds);
    for (let i = bubble.location; i < parentBubble.childBubbleIds.length; i++) {
      const childBubble = getBubbleById(bubbleList, parentBubble.childBubbleIds[i]);
      childBubble.location = i;
    }
  } catch (err) {
  //  throw err;
  }
}

function createBubble(bubble: Bubble, menu: MenuType) {

}

function editBubble(bubble: Bubble, newContent: string) {

}

function wrapBubble(wrapBubbleList: Array<Bubble>): Promise<void> {

  return Promise.resolve(null);
}

export const getRootBubble = (state: BubbleState) => state.rootBubble;
export const getBubbleList = (state: BubbleState) => state.bubbleList;
