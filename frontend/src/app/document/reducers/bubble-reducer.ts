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
    editBubble, mergeBubble, wrapBubble, moveBubble, splitBubble} from './bubble-operation';

export enum ViewBoardMenuType {
    none = 1,
    wrap,
    merge,
    move
}

export interface BubbleState {
    documentId: number;
    bubbleList: Bubble[];

    selectedBubbleList: Bubble[];
    hoverBubbleList: Bubble[];
    selectedMenu: MenuType;

    viewBoardMenuType: ViewBoardMenuType;

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

    viewBoardMenuType: ViewBoardMenuType.none,

    loading: false,
    error: '',

    request: -1,
};

export function BubbleReducer(state: BubbleState = initialState, action: fromBubble.Actions) {
    switch (action.type) {
        case fromBubble.SELECT: case fromBubble.SELECT_CLEAR:
        case fromBubble.MOUSE_OVER: case fromBubble.MOUSE_OUT:
            return UIReducer(state, action);

        case fromBubble.LOAD:
            return {...initialState, loading: true, documentId: action.payload};
        case fromBubble.LOAD_COMPLETE: {
            const bubbleList = MockBubbleList;
            // TODO: changed to mock bubble list
            // return {...state, bubbleList: [...action.payload], rootBubble: root, loading: false};
            return {...state, bubbleList: [...bubbleList], loading: false};
        }
        case fromBubble.LOAD_ERROR:
            return {...state, error: action.payload};

        case fromBubble.POP: case fromBubble.POP_COMPLETE: case fromBubble.POP_ERROR:
        case fromBubble.DELETE: case fromBubble.DELETE_COMPLETE: case fromBubble.DELETE_ERROR:
        case fromBubble.CREATE: case fromBubble.CREATE_COMPLETE: case fromBubble.CREATE_ERROR:
        case fromBubble.EDIT: case fromBubble.EDIT_COMPLETE: case fromBubble.DELETE_ERROR:
        case fromBubble.FLATTEN: case fromBubble.FLATTEN_COMPLETE: case fromBubble.FLATTEN_ERROR:
        case fromBubble.WRAP_START: case fromBubble.WRAP: case fromBubble.WRAP_COMPLETE: case fromBubble.WRAP_ERROR:
        case fromBubble.MERGE_START: case fromBubble.MERGE: case fromBubble.MERGE_COMPLETE: case fromBubble.MERGE_ERROR:
        case fromBubble.SPLIT: case fromBubble.SPLIT_COMPLETE: case fromBubble.SPLIT_ERROR:
        case fromBubble.MOVE:  case fromBubble.MOVE_COMPLETE: case fromBubble.MOVE_ERROR:
            return BubbleOperationReducer(state, action);

        case fromBubble.CLEAR_ERROR:
            return {...state, error: ''};

        default:
            return state;
    }
}

function UIReducer(state: BubbleState, action: fromBubble.Actions) {
    const newBubbleList = _.cloneDeep(state);
    switch (action.type) {
        case fromBubble.SELECT:
        if (state.loading) {
            return {...state, error: 'please wait'};
        }
        const selectedBubble = action.payload.bubble;
        const selectedMenu = action.payload.menu;

        if (state.viewBoardMenuType === ViewBoardMenuType.none) {
            if (isBubbleInList(state.selectedBubbleList, selectedBubble.id)) {
                return {...state, selectedBubbleList: [], selectedMenu: null };
            } else {
                const newSelectedBubbleList = [selectedBubble];
                return {...state, selectedBubbleList: newSelectedBubbleList, selectedMenu: selectedMenu };
            }
        } else if ((state.viewBoardMenuType === ViewBoardMenuType.wrap || state.viewBoardMenuType === ViewBoardMenuType.merge ) &&
                   (selectedMenu === MenuType.internalMenu || selectedMenu === MenuType.leafMenu) &&
                   (state.selectedBubbleList[0].parentBubbleId === selectedBubble.parentBubbleId)) {

                console.log('add new wrap bubble');
            let newSelectedBubbleList = [...state.selectedBubbleList];
            if (isBubbleInList(newSelectedBubbleList, selectedBubble.id)) {
                newSelectedBubbleList = newSelectedBubbleList.filter(b => b.id !== selectedBubble.id);
                if (newSelectedBubbleList.length === 0) {
                    return {...state, selectedBubbleList: [], viewBoardMenuType: ViewBoardMenuType.none, selectedMenu: null };
                }
            } else {
                newSelectedBubbleList.push(selectedBubble);
            }
            return {...state, selectedBubbleList: newSelectedBubbleList };
        } else {
            return {...state};
        }

        case fromBubble.SELECT_CLEAR:
            return {...state, selectedBubbleList: [], selectedMenu: null, viewBoardMenuType: ViewBoardMenuType.none};

        case fromBubble.MOUSE_OVER:
            const newHoverBubbleList = [];
            mouseOverBubble(state.bubbleList, newHoverBubbleList, action.payload);
            return {...state, hoverBubbleList: newHoverBubbleList };

        case fromBubble.MOUSE_OUT:
            return {...state, hoverBubbleList: []};

        default:
            console.log('this should not be called', state, action);
            return newBubbleList;
    }
}

function BubbleOperationReducer(state: BubbleState, action: fromBubble.Actions) {
    switch (action.type) {

        case fromBubble.POP:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.POP_COMPLETE: {
            const bubbleId = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            popBubble(newBubbleList, bubbleId);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.POP_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.DELETE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.DELETE_COMPLETE: {
            const bubbleId = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            deleteBubble(newBubbleList, bubbleId);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.DELETE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.CREATE:
            return {...state, selectedBubbleList: [action.payload.bubbleId], loading: true, selectedMenu: null, hoverBubbleList: []};
        case fromBubble.CREATE_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const isAbove = action.payload.isAbove;
            const newBubble = action.payload.newBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            createBubble(newBubbleList, bubbleId, isAbove, newBubble);
            return {...state, bubbleList: newBubbleList, loading: false };
        }
        case fromBubble.CREATE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.EDIT:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const newContent = action.payload.newContent;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            console.log('hello');
            editBubble(newBubbleList, bubbleId, newContent);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.EDIT_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.FLATTEN:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.FLATTEN_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const newLeafBubble = action.payload.newBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            flattenBubble(newBubbleList, bubbleId, newLeafBubble);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.FLATTEN_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.WRAP_START:
            return {...state, viewBoardMenuType: ViewBoardMenuType.wrap , selectedMenu: null, hoverBubbleList: []};
        case fromBubble.WRAP:
            return {...state, viewBoardMenuType: ViewBoardMenuType.none, loading: true};
        case fromBubble.WRAP_COMPLETE: {
            const wrapBubbleIds = action.payload.wrapBubbleIds;
            const newInternalBubble = action.payload.newInternalBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            wrapBubble(newBubbleList, wrapBubbleIds, newInternalBubble);
            return {...state, bubbleList: newBubbleList, loading: false, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.WRAP_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.MERGE_START:
            return {...state, viewBoardMenuType: ViewBoardMenuType.merge , selectedMenu: null, hoverBubbleList: []};
        case fromBubble.MERGE:
            return {...state, loading: true, viewBoardMenuType: ViewBoardMenuType.none};
        case fromBubble.MERGE_COMPLETE: {
            const mergeBubbleIds = action.payload.mergeBubbleIds;
            const newLeafBubble = action.payload.newBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            mergeBubble(newBubbleList, mergeBubbleIds, newLeafBubble);
            return {...state, bubbleList: newBubbleList, loading: false, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.MERGE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.SPLIT:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.SPLIT_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const splitBubbleList = action.payload.splitBubbleList;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            splitBubble(newBubbleList, bubbleId, splitBubbleList);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.SPLIT_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.MOVE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.MOVE_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const destBubbleId = action.payload.destBubbleId;
            const isAbove = action.payload.isAbove;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            moveBubble(newBubbleList, bubbleId, destBubbleId, isAbove);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.MOVE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        default:
            console.log('this should not be called', state, action);
            return state;
    }
}
