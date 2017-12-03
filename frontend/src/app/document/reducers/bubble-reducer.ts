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
            return {...state, bubbleList: [...action.payload], rootBubble: root, loading: false};
        }
        case fromBubble.LOAD_ERROR:
            return {...state, error: action.payload};
        case fromBubble.POP:
            return {...state, loading: true};
        case fromBubble.POP_COMPLETE: {
            const bubble = action.payload;
            popBubble(state.bubbleList, bubble.id);
            return {...state, loading: false};
        }
        case fromBubble.DELETE:
            return {...state, loading: true};
        case fromBubble.DELETE_COMPLETE: {
            const bubble = action.payload;
            deleteBubble(state.bubbleList, bubble.id);
            return {...state, loading: false};
        }
        case fromBubble.CREATE:
            return {...state, selectedBubble: action.payload.bubble, loading: true};
        case fromBubble.CREATE_COMPLETE: {
            const bubble = action.payload.bubble;
            const isAbove = action.payload.isAbove;
            const newBubble = action.payload.newBubble;
            createBubble(state.bubbleList, bubble.id, isAbove, newBubble);
            return {...state, selectedBubble: bubble, loading: false};
        }
        case fromBubble.EDIT:
            return {...state, loading: true};
        case fromBubble.EDIT_COMPLETE: {
            const bubble = action.payload.bubble;
            const newContent = action.payload.newContent;
            editBubble(state.bubbleList, bubble.id, newContent);
            return {...state, loading: false};
        }
        case fromBubble.FLATTEN:
            return {...state, loading: true};
        case fromBubble.FLATTEN_COMPLETE: {
            const bubble = action.payload.bubble;
            const newBubble = action.payload.newBubble;
            flattenBubble(state.bubbleList, bubble.id, newBubble);
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
  } catch(err) {
    throw err;
  }
}

function deleteBubble(bubbleList: Array<Bubble>, id: number) {
  try {
    const bubble = getBubbleById(bubbleList, id);
    const parentBubble = getParentBubble(bubbleList, bubble);

    deleteChildBubbles(bubbleList, id);

    parentBubble.childBubbleIds.splice(bubble.location, 1);

    for (let i = bubble.location; i < parentBubble.childBubbleIds.length; i++) {
      const childBubble = getBubbleById(bubbleList, parentBubble.childBubbleIds[i]);
      childBubble.location = i;
    }
  } catch(err) {
    console.log(err);
  //  throw err;
  }
}

function popBubble(bubbleList: Array<Bubble>, id: number) {
    try {
        const bubble = getBubbleById(bubbleList, id);
        if (bubble.type !== BubbleType.internalBubble) {
            throw new Error('Cannot pop leafBubble');
        }
        const internalBubble = bubble as InternalBubble;
        const parentBubble = getParentBubble(bubbleList, bubble);

        let childBubbleIds = internalBubble.childBubbleIds;
        parentBubble.childBubbleIds.splice(bubble.location, 1, ...childBubbleIds);

        for (let i = bubble.location; i < parentBubble.childBubbleIds.length; i++) {
            const childBubble = getBubbleById(bubbleList, parentBubble.childBubbleIds[i]);
            childBubble.location = i;
            childBubble.parentBubbleId = parentBubble.id;
        }
        removeBubbleById(bubbleList, bubble.id);

    } catch(err) {
        console.log(err);
        //  throw err;
    }
}

function getContent(bubbleList: Array<Bubble>, id: number): string {
    try {
        const bubble = getBubbleById(bubbleList, id);

        if (bubble.type === BubbleType.leafBubble) {
            const leafBubble = bubble as LeafBubble;
            return leafBubble.content;

        } else if (bubble.type === BubbleType.internalBubble) {
            const internalBubble = bubble as InternalBubble;
            let content = '';
            for (let childBubbleId of internalBubble.childBubbleIds) {
                content += getContent(bubbleList, childBubbleId) + ' ';
            }
            return content;
        }
    } catch(err) {
        console.log(err);
        //  throw err;
    }
}

function flattenBubble(bubbleList: Array<Bubble>, id: number, newBubble: Bubble) {
    try {
        const bubble = getBubbleById(bubbleList, id);
        if (bubble.type !== BubbleType.internalBubble) {
            throw new Error('Cannot flatten leafBubble');
        }
        const internalBubble = bubble as InternalBubble;
        const parentBubble = getParentBubble(bubbleList, bubble);
        (newBubble as LeafBubble).content = getContent(bubbleList, id);
        console.log(newBubble);
        newBubble.parentBubbleId = parentBubble.id;
        newBubble.location = internalBubble.location;
        parentBubble.childBubbleIds[internalBubble.location] = newBubble.id;
        bubbleList.push(newBubble);
        deleteChildBubbles(bubbleList, id);

    } catch(err) {
        console.log(err);
        //  throw err;
    }
}

function createBubble(bubbleList: Array<Bubble>, id: number, isAbove: boolean, newBubble: Bubble) {
    try {
        const bubble = getBubbleById(bubbleList, id);
        const parentBubble = getParentBubble(bubbleList, bubble);
        if (isAbove) {
            parentBubble.childBubbleIds.splice(bubble.location, 0, newBubble.id);
        } else {
            parentBubble.childBubbleIds.splice(bubble.location + 1, 0, newBubble.id);
        }

        bubbleList.push(newBubble);
        newBubble.parentBubbleId = parentBubble.id;

        for (let i = bubble.location; i < parentBubble.childBubbleIds.length; i++) {
          const childBubble = getBubbleById(bubbleList, parentBubble.childBubbleIds[i]);
          childBubble.location = i;
          childBubble.parentBubbleId = parentBubble.id;
        }
    } catch (err) {
        console.log(err);
    //    throw err;
    }
}

function editBubble(bubbleList: Array<Bubble>, id: number, newContent: string) {
    try {
        const bubble = getBubbleById(bubbleList, id);
        if (bubble.type !== BubbleType.leafBubble) {
            throw new Error('Edit bubble should be a leaf bubble')
        }
        const leafBubble = bubble as LeafBubble;
        leafBubble.content = newContent;

    } catch (err) {
        console.log(err);
    //    throw err;
    }
}

function wrapBubble(wrapBubbleList: Array<Bubble>): Promise<void> {

  return Promise.resolve(null);
}

export const getRootBubble = (state: BubbleState) => state.rootBubble;
export const getBubbleList = (state: BubbleState) => state.bubbleList;
