import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';
import { Comment } from '../models/comment';
import { Note } from '../models/note';
import { User } from '../../user/models/user';
import { MenuType } from '../services/event/event-bubble.service';

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
    move,
    split
}

export interface BubbleState {
    documentId: number;
    connectors: User[];
    bubbleList: Bubble[];
    suggestBubbleList: SuggestBubble[];
    commentList: Comment[];
    noteList: Note[];

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
    connectors: [],
    bubbleList: [],
    suggestBubbleList: [],
    commentList: [],
    noteList: [],

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

        case fromBubble.OPEN: case fromBubble.OPEN_COMPLETE: case fromBubble.OPEN_ERROR: case fromBubble.OTHERS_OPEN_DOCUMENT:
        case fromBubble.CLOSE: case fromBubble.CLOSE_COMPLETE: case fromBubble.CLOSE_ERROR: case fromBubble.OTHERS_CLOSE_DOCUMENT:
        case fromBubble.LOAD: case fromBubble.LOAD_COMPLETE: case fromBubble.LOAD_ERROR:
        case fromBubble.POP_BUBBLE: case fromBubble.POP_BUBBLE_COMPLETE: case fromBubble.POP_BUBBLE_ERROR:
        case fromBubble.DELETE_BUBBLE: case fromBubble.DELETE_BUBBLE_COMPLETE: case fromBubble.DELETE_BUBBLE_ERROR:
        case fromBubble.CREATE_BUBBLE: case fromBubble.CREATE_BUBBLE_COMPLETE: case fromBubble.CREATE_BUBBLE_ERROR:
        case fromBubble.EDIT_BUBBLE: case fromBubble.EDIT_REQUEST_SUCCESS: case fromBubble.EDIT_BUBBLE_ERROR:
        case fromBubble.EDIT_UPDATE_SUCCESS:
        case fromBubble.FLATTEN_BUBBLE: case fromBubble.FLATTEN_BUBBLE_COMPLETE: case fromBubble.FLATTEN_BUBBLE_ERROR:
        case fromBubble.WRAP_START: case fromBubble.WRAP_BUBBLE: case fromBubble.WRAP_BUBBLE_COMPLETE: case fromBubble.WRAP_BUBBLE_ERROR:
        case fromBubble.MERGE_START: case fromBubble.MERGE_BUBBLE:
        case fromBubble.MERGE_BUBBLE_COMPLETE: case fromBubble.MERGE_BUBBLE_ERROR:
        case fromBubble.SPLIT_LEAF_START: case fromBubble.SPLIT_LEAF: case fromBubble.SPLIT_LEAF_COMPLETE: case fromBubble.SPLIT_LEAF_ERROR:
        case fromBubble.MOVE_BUBBLE_START: case fromBubble.MOVE_BUBBLE: 
        case fromBubble.MOVE_BUBBLE_COMPLETE: case fromBubble.MOVE_BUBBLE_ERROR:
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

        case fromBubble.OPEN:
            return {...initialState, loading: true}
        case fromBubble.OPEN_COMPLETE:
            // TODO: add contributors info to document object
            return {...state, loading: false, connectors: action.payload.connectors}
        case fromBubble.OPEN_ERROR:
            return {...state, loading: false, error: action.payload, documentId: -1};
        case fromBubble.OTHERS_OPEN_DOCUMENT:
            const addConnectors = _.cloneDeep(state.connectors);
            addConnectors.push(action.payload)
            return {...state, connectors: addConnectors}
        case fromBubble.CLOSE:
            return {...state, loading: true}
        case fromBubble.CLOSE_COMPLETE:
            return {...state, loading: false, documentId: -1};
        case fromBubble.CLOSE_ERROR:
            return {...state, loading: false, error: action.payload}
        case fromBubble.OTHERS_CLOSE_DOCUMENT:
            const deleteConnectors = _.cloneDeep(state.connectors);
            const index = deleteConnectors.indexOf(action.payload, 0);
            try {
                if (index > -1) {
                    deleteConnectors.splice(index, 1);
                } else {
                    throw new Error('connector who closed document is not in connectors list');
                }
            } catch (err){ 
            }
            return {...state, connectors: deleteConnectors};
        case fromBubble.LOAD:
            return {...state, loading: true, documentId: action.payload};
        case fromBubble.LOAD_COMPLETE: {
            console.log(action.payload);
            return {...state, bubbleList: [...action.payload.bubbleList],
                suggestBubbleList: [action.payload.suggestBubbleList], commentLIst: [action.payload.commentList],
                noteList: [action.payload.noteList], loading: false};
        }
        case fromBubble.LOAD_ERROR:
            return {...state, error: action.payload, loading:false, documentId: -1};
        case fromBubble.POP_BUBBLE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.POP_BUBBLE_COMPLETE: {
            const bubbleId = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            popBubble(newBubbleList, bubbleId);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.POP_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.DELETE_BUBBLE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.DELETE_BUBBLE_COMPLETE: {
            const bubbleId = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            deleteBubble(newBubbleList, bubbleId);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.DELETE_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.CREATE_BUBBLE:
            return {...state, selectedBubbleList: [action.payload.bubbleId], loading: true, selectedMenu: null, hoverBubbleList: []};
        case fromBubble.CREATE_BUBBLE_COMPLETE: {
            const newBubble = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            createBubble(newBubbleList, newBubble);
            return {...state, bubbleList: newBubbleList, loading: false };
        }
        case fromBubble.CREATE_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.EDIT_BUBBLE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_REQUEST_SUCCESS: {
            const bubbleId = action.payload.bubbleId;
            const userId = action.payload.userId;
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.editLockHoder = userId;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.EDIT_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_UPDATE_SUCCESS:
            console.log(action.payload);
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            console.log(bubbleId, content);
        //    const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
    //        bubble.content = content;
    //        const newBubbleList = _.cloneDeep(state.bubbleList);
    //        return {...state, bubbleList: newBubbleList, loading: false};
           return {...state, loading: false};
        case fromBubble.FLATTEN_BUBBLE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.FLATTEN_BUBBLE_COMPLETE: {
            const bubbleId = action.payload;
            const newLeafBubble = new LeafBubble(bubbleId);
            const newBubbleList = _.cloneDeep(state.bubbleList);
            flattenBubble(newBubbleList, bubbleId, newLeafBubble);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.FLATTEN_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.WRAP_START:
            return {...state, viewBoardMenuType: ViewBoardMenuType.wrap , selectedMenu: null, hoverBubbleList: []};
        case fromBubble.WRAP_BUBBLE:
            return {...state, viewBoardMenuType: ViewBoardMenuType.none, loading: true};
        case fromBubble.WRAP_BUBBLE_COMPLETE: {
            const wrapBubbleIds = action.payload.wrapBubbleIdList;
            const newInternalBubble = action.payload.newWrappedBubble as InternalBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            wrapBubble(newBubbleList, wrapBubbleIds, newInternalBubble);
            return {...state, bubbleList: newBubbleList, loading: false, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.WRAP_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.MERGE_START:
            return {...state, viewBoardMenuType: ViewBoardMenuType.merge , selectedMenu: null, hoverBubbleList: []};
        case fromBubble.MERGE_BUBBLE:
            return {...state, loading: true, viewBoardMenuType: ViewBoardMenuType.none};
        case fromBubble.MERGE_BUBBLE_COMPLETE: {
            const mergeBubbleIds = action.payload.bubbleIdList;
            const newLeafBubble = action.payload.mergedBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            mergeBubble(newBubbleList, mergeBubbleIds, newLeafBubble);
            return {...state, bubbleList: newBubbleList, loading: false, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.MERGE_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.SPLIT_LEAF_START:
            return {...state, loading: false, viewBoardMenuType: ViewBoardMenuType.split,
                selectedBubbleList: [action.payload], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.SPLIT_LEAF:
            return {...state, loading: true, viewBoardMenuType: ViewBoardMenuType.none,
                selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.SPLIT_LEAF_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const splitBubbleList = action.payload.splitBubbleObjectList;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            splitBubble(newBubbleList, bubbleId, splitBubbleList);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.SPLIT_LEAF_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

            // internal
        case fromBubble.SPLIT_INTERNAL_START:
            return {...state, loading: false, viewBoardMenuType: ViewBoardMenuType.split,
                selectedBubbleList: [action.payload], selectedMenu: null, hoverBubbleList: []};
            // split_internal <- viewBoardMenuType: ViewBoardMenuType.none, refer leaf split

        case fromBubble.MOVE_BUBBLE_START:
            return {...state, loading: false, viewBoardMenuType: ViewBoardMenuType.move,
                selectedBubbleList: [action.payload], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.MOVE_BUBBLE:
            return {...state, loading: true, viewBoardMenuType: ViewBoardMenuType.none,
                 selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.MOVE_BUBBLE_COMPLETE: {
            const bubbleId = action.payload.bubbleId;
            const newParentId = action.payload.newParentId;
            const newLocation = action.payload.newLocation;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            moveBubble(newBubbleList, bubbleId, newParentId, newLocation);
            return {...state, bubbleList: newBubbleList, loading: false};
        //    return {...state, loading: false};
        }
        case fromBubble.MOVE_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        default:
            console.log('this should not be called', state, action);
            return state;
    }
}
