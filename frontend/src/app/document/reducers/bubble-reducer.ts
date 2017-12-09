import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';
import { MockBubbleRoot, MockBubbleList } from '../models/bubble.mock';

import * as fromBubble from '../actions/bubble-action';
import * as _ from 'lodash';

import {
    getBubbleById,
    isBubbleInList,
    mouseOverBubble,
    deleteBubble, popBubble, getContent, flattenBubble, createBubble,
    editBubble, mergeBubble, wrapBubble, moveBubble} from './bubble-operation';

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

    request: number;
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
    error: '',

    request: -1,
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

