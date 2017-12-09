import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';
import { MockBubbleRoot, MockBubbleList } from '../models/bubble.mock';

import * as fromBubble from '../actions/bubble-action';
import * as _ from 'lodash';

export interface BubbleState {
    documentId: number;
    bubbleList: Bubble[];

    selectedBubbleList: Bubble[];
    hoverBubbleList: Bubble[];
    selectedMenu: MenuType;
    isMoveAction: boolean;
    isWrapAction: boolean;

    sangjunBoardBubble: Bubble;

    loading: boolean;
    error: string;
}

const initialState: BubbleState = {
    documentId: -1,
    bubbleList: [],

    selectedBubbleList: [],
    hoverBubbleList: [],
    selectedMenu: null,
    isMoveAction: false,
    isWrapAction: false,

    sangjunBoardBubble: null,

    loading: false,
    error: ''
};

export function BubbleReducer(state: BubbleState = initialState, action: fromBubble.Actions) {
    switch (action.type) {
        case fromBubble.SELECT:
            if (state.loading) {
                return {...state, error: 'please wait'};
            }
            const selectedBubble = action.payload.bubble;
            const selectedMenu = action.payload.menu;

            if (!state.isMoveAction && !state.isWrapAction) {
                if (isBubbleInList(state.selectedBubbleList, selectedBubble.id)) {
                    return {...state, selectedBubbleList: [], selectedMenu: null };
                } else {
                    const newSelectedBubbleList = [selectedBubble];
                    return {...state, selectedBubbleList: newSelectedBubbleList, selectedMenu: selectedMenu };
                }
            } else if (state.isWrapAction &&
                (selectedMenu === MenuType.internalMenu || selectedMenu === MenuType.leafMenu) &&
                (state.selectedBubbleList[0].parentBubbleId === selectedBubble.id)) {

                let newSelectedBubbleList = [...state.selectedBubbleList];
                if (isBubbleInList(newSelectedBubbleList, selectedBubble.id)) {
                    newSelectedBubbleList = newSelectedBubbleList.filter(b => b.id !== selectedBubble.id);
                    if (newSelectedBubbleList.length === 0) {
                        return {...state, selectedBubbleList: [], isWrapAction: false, selectedMenu: null };
                    }
                } else {
                    newSelectedBubbleList.push(selectedBubble);
                }
                return {...state, selectedBubbleList: newSelectedBubbleList };
            } else {
                return {...state};
            }

        case fromBubble.SELECT_CLEAR:
            return {...state, selectedBubbleList: [], selectedMenu: null};

        case fromBubble.SELECT_SANGJUN_BOARD:
            return {...state, sangjunBoardBubble: action.payload };

        case fromBubble.MOUSE_OVER:
            const newHoverBubbleList = [];
            mouseOverBubble(state.bubbleList, newHoverBubbleList, action.payload);
            return {...state, hoverBubbleList: newHoverBubbleList };

        case fromBubble.MOUSE_OUT:
            return {...state, hoverBubbleList: []};

        case fromBubble.LOAD:
            return {...state, loading: true, documentId: action.payload};
        case fromBubble.LOAD_COMPLETE: {
            const bubbleList = MockBubbleList;
            // TODO: changed to mock bubble list
            // return {...state, bubbleList: [...action.payload], rootBubble: root, loading: false};
            return {...state, bubbleList: [...bubbleList], loading: false};
        }
        case fromBubble.LOAD_ERROR:
            return {...state, error: action.payload};
        case fromBubble.POP:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.POP_COMPLETE: {
            const bubbleId = action.payload;
            popBubble(state.bubbleList, bubbleId);
            return {...state, loading: false};
        }
        case fromBubble.DELETE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.DELETE_COMPLETE: {
            const bubbleId = action.payload;
            deleteBubble(state.bubbleList, bubbleId);
            return {...state, loading: false};
        }
        case fromBubble.CREATE:
            return {...state, selectedBubbleList: [action.payload.bubbleId], loading: true, selectedMenu: null, hoverBubbleList: []};
        case fromBubble.CREATE_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const isAbove = action.payload.isAbove;
            const newBubble = action.payload.newBubble;
            createBubble(state.bubbleList, bubbleId, isAbove, newBubble);
            return {...state, loading: false };
        }
        case fromBubble.EDIT:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const newContent = action.payload.newContent;
            editBubble(state.bubbleList, bubbleId, newContent);
            return {...state, loading: false};
        }
        case fromBubble.FLATTEN:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.FLATTEN_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            const newLeafBubble = action.payload.newBubble;
            const bubbleList = flattenBubble(newBubbleList, bubbleId, newLeafBubble);

            return {...state, bubbleList: bubbleList, loading: false};
        }
        case fromBubble.WRAP:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.WRAP_COMPLETE: {
            const wrapBubbleIds = action.payload.wrapBubbleIds;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            const newInternalBubble = action.payload.newInternalBubble;
            const bubbleList = wrapBubble(newBubbleList, wrapBubbleIds, newInternalBubble);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.MERGE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.MERGE_COMPLETE: {
            const mergeBubbleIds = action.payload.mergeBubbleIds;
            const newLeafBubble = action.payload.newBubble;
            const bubbleList = mergeBubble(state.bubbleList, mergeBubbleIds, newLeafBubble);
            return {...state, bubbleList: _.cloneDeep(bubbleList), loading: false};
        }
        case fromBubble.SPLIT:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.SPLIT_COMPLETE: {
            const bubbleId = action.payload;
            return {...state, loading: false};
        }
        case fromBubble.MOVE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.MOVE_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const destBubbleId = action.payload.destBubbleId;
            const isAbove = action.payload.isAbove;
            const bubbleList = moveBubble(state.bubbleList, bubbleId, destBubbleId, isAbove);
            return {...state, bubbleList: _.cloneDeep(bubbleList), loading: false};
        }
        case fromBubble.CLEAR_ERROR:
            return {...state, error: ''};
        default:
        return state;
    }
}

function UIReducer(state: BubbleState, action: fromBubble.Actions) {
    const newBubbleList = _.cloneDeep(state);
    switch (action.type) {
        default:
            return newBubbleList;
    }
}

export function getBubbleById(bubbleList: Array<Bubble>, id: number): Bubble {
    const bList = bubbleList.filter((bubble) => (bubble.id === id));
    if (bList.length === 0) {
        throw new Error(`Does not exist with this id: ${id}`);
    }
    return bList[0];
}

export function isBubbleInList(bubbleList: Array<Bubble>, id: number): boolean {
    for (const b of bubbleList) {
        if (b.id === id) {
            return true;
        }
    }
    return false;
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
    } catch (err) {
        throw new Error('Does not exist parent bubble');
    }
}

function mouseOverBubble(bubbleList: Array<Bubble>, hoverBubbleList: Array<Bubble>, bubble: Bubble): void {
    hoverBubbleList.push(bubble);
    if (bubble.id !== 0 && bubble.type === BubbleType.internalBubble) {
        (bubble as InternalBubble).childBubbleIds.forEach(id => {
            const child = getBubbleById(bubbleList, id);
            mouseOverBubble(bubbleList, hoverBubbleList, child);
        });
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
    } catch (err) {
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

        const childBubbleIds = internalBubble.childBubbleIds;
        parentBubble.childBubbleIds.splice(bubble.location, 1, ...childBubbleIds);

        for (let i = bubble.location; i < parentBubble.childBubbleIds.length; i++) {
            const childBubble = getBubbleById(bubbleList, parentBubble.childBubbleIds[i]);
            childBubble.location = i;
            childBubble.parentBubbleId = parentBubble.id;
        }
        removeBubbleById(bubbleList, bubble.id);

    } catch (err) {
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
            for (const childBubbleId of internalBubble.childBubbleIds) {
                content += getContent(bubbleList, childBubbleId) + ' ';
            }
            return content;
        }
    } catch (err) {
        console.log(err);
        //  throw err;
    }
}

function flattenBubble(bubbleList: Array<Bubble>, id: number, newBubble: Bubble): Array<Bubble>  {
    try {
        const bubble = getBubbleById(bubbleList, id);
        if (bubble.type !== BubbleType.internalBubble) {
            throw new Error('Cannot flatten leafBubble');
        }
        console.log(bubbleList);
        const internalBubble = bubble as InternalBubble;
        const parentBubble = getParentBubble(bubbleList, bubble);
        (newBubble as LeafBubble).content = getContent(bubbleList, id);
        newBubble.parentBubbleId = parentBubble.id;
        newBubble.location = internalBubble.location;
        parentBubble.childBubbleIds[internalBubble.location] = newBubble.id;
        bubbleList.push(newBubble);
        deleteChildBubbles(bubbleList, id);
        console.log(newBubble);
        console.log(bubbleList);

        return bubbleList;

    } catch (err) {
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
            throw new Error('Edit bubble should be a leaf bubble');
        }
        const leafBubble = bubble as LeafBubble;
        leafBubble.content = newContent;

    } catch (err) {
        console.log(err);
    //    throw err;
    }
}

function mergeBubble(bubbleList: Array<Bubble>, mergeBubbleIds: Array<number>, newBubble: Bubble): Array<Bubble> {
    try {

        console.log('[before merge]', bubbleList);
        // if their locations are all neighbors
        // if they have the same parent
        // sort mergeBubbleIds
        const mergeBubbleList: Array<Bubble> = [];
        for (const mergeBubbleId of mergeBubbleIds) {
            mergeBubbleList.push(getBubbleById(bubbleList, mergeBubbleId));
        }

        const parentBubbleId = mergeBubbleList[0].parentBubbleId;
        const parentBubble = getParentBubble(bubbleList, mergeBubbleList[0]);
        for (const mergeBubble of mergeBubbleList) {
            if (mergeBubble.parentBubbleId !== parentBubbleId)
                throw new Error('merge bubbles should have same parent id');
        }

        let newContent = '';
        const newLocation = mergeBubbleList[0].location;
        for (const mergeBubble of mergeBubbleList) {
            newContent += getContent(bubbleList, mergeBubble.id);
        }
        const leafBubble = newBubble as LeafBubble;
        leafBubble.content = newContent;
        leafBubble.location = newLocation;
        leafBubble.parentBubbleId = parentBubbleId;

        bubbleList.push(leafBubble);

        for (const mergeBubble of mergeBubbleList) {
            const index = parentBubble.childBubbleIds.findIndex((id) => (id === mergeBubble.id));
            parentBubble.childBubbleIds.splice(index, 1);
            deleteChildBubbles(bubbleList, mergeBubble.id);
        }
        parentBubble.childBubbleIds.splice(newLocation, 0, leafBubble.id);

        console.log('[after merge]', bubbleList);
    } catch (err) {
        console.log(err);
    //    throw err;
    }
    return bubbleList;
}

function wrapBubble(bubbleList: Array<Bubble>, wrapBubbleIds: Array<number>, newInternalBubble: InternalBubble): Array<Bubble> {
    try {
        console.log('[before wrap]', bubbleList);
        // if their locations are all neighbors
        // if they have the same parent
        // sort wrapBubbleIds
        const wrapBubbleList: Array<Bubble> = [];
        for (const wrapBubbleId of wrapBubbleIds) {
            wrapBubbleList.push(getBubbleById(bubbleList, wrapBubbleId));
        }

        const parentBubbleId = wrapBubbleList[0].parentBubbleId;
        const parentBubble = getParentBubble(bubbleList, wrapBubbleList[0]);
        for (const wrapBubble of wrapBubbleList) {
            if (wrapBubble.parentBubbleId !== parentBubbleId)
                throw new Error('wrap bubbles should have same parent id');
        }

        const newLocation = wrapBubbleList[0].location;
        newInternalBubble.location = newLocation;
        newInternalBubble.parentBubbleId = parentBubbleId;
        newInternalBubble.childBubbleIds = wrapBubbleIds;
        bubbleList.push(newInternalBubble);

        for (let i = 0; i < wrapBubbleList.length; i++) {
            const wrapBubble = wrapBubbleList[i];
            const index = parentBubble.childBubbleIds.findIndex((id) => (id === wrapBubble.id));
            parentBubble.childBubbleIds.splice(index, 1);
            wrapBubble.location = i;
        }
        parentBubble.childBubbleIds.splice(newLocation, 0, newInternalBubble.id);

        console.log('[after wrap]', bubbleList);

    } catch(err) {
        console.log(err);
    //    throw err;
    }
    return bubbleList;
}

function moveBubble(bubbleList: Array<Bubble>, id: number, destBubbleId: number, isAbove: boolean): Array<Bubble> {
    try {
        console.log('[before move]', bubbleList);
        // only leaf?
        const destBubble = getBubbleById(bubbleList, destBubbleId);
        const parentDestBubble = getParentBubble(bubbleList, destBubble);
        const bubble = getBubbleById(bubbleList, id);
        const parentBubble = getParentBubble(bubbleList, bubble);

        if (bubble.type !== BubbleType.leafBubble) {
            throw new Error('only leaf bubble is movable');
        }

        parentBubble.childBubbleIds.splice(bubble.location, 1);
        for (let i = bubble.location; i < parentBubble.childBubbleIds.length; i++) {
            const childBubble = getBubbleById(bubbleList, parentBubble.childBubbleIds[i]);
            childBubble.location = i;
            childBubble.parentBubbleId = parentBubble.id;
        }

        if (isAbove) {
            parentDestBubble.childBubbleIds.splice(destBubble.location, 0, bubble.id);
        } else {
            parentDestBubble.childBubbleIds.splice(destBubble.location + 1, 0, bubble.id);
        }

        for (let i = destBubble.location; i < parentDestBubble.childBubbleIds.length; i++) {
            const childBubble = getBubbleById(bubbleList, parentDestBubble.childBubbleIds[i]);
            childBubble.location = i;
            childBubble.parentBubbleId = parentDestBubble.id;
        }

        console.log('[after move]', bubbleList);

    } catch (err) {
        console.log(err);
    //    throw err;
    }
    return bubbleList;
}
