import { Action } from '@ngrx/store';

import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble, Suggest } from '../models/bubble';
import { Comment } from '../models/comment';
import { Note } from '../models/note';
import { User } from '../../user/models/user';
import { Document } from '../../file/models/document';
import { MenuType } from '../services/event/event-bubble.service';

import * as fromBubble from '../actions/bubble-action';
import * as _ from 'lodash';

import {
    getBubbleById,
    getSuggestBubbleById,
    isBubbleInList,
    mouseOverBubble,
    deleteBubble, popBubble, getContent, flattenBubble, createBubble,
    editBubble, mergeBubble, wrapBubble, moveBubble, splitBubble, switchBubble} from './bubble-operation';

export enum ViewBoardMenuType {
    none = 1,
    wrap,
    merge,
    move,
    split
}

export interface BubbleState {
    documentObject: Document;
    connectors: User[];

    bubbleList: Bubble[];
    suggestBubbleList: SuggestBubble[];
    commentList: Comment[];
    noteList: Note[];

    selectedSB: SuggestBubble;
    selectedBubbleList: Bubble[];
    hoverBubbleList: Bubble[];
    selectedMenu: MenuType;

    viewBoardMenuType: ViewBoardMenuType;

    editSuggests: Array<{isBindSuggest: boolean, bindBubbleId: number, content: string}>

    editBubbleId: number;
    editBubbleString: string;
    editActiveBubbleIds: Array<number>;

    loading: boolean;
    error: string;
    msg: string;

    request: number;
    routeAfterClose: string;
}

const initialState: BubbleState = {
    documentObject: null,
    connectors: [],

    bubbleList: [],
    suggestBubbleList: [],
    commentList: [],
    noteList: [],

    selectedSB: null,
    selectedBubbleList: [],
    hoverBubbleList: [],
    selectedMenu: null,

    viewBoardMenuType: ViewBoardMenuType.none,

    editSuggests: [],

    editBubbleId: -1,
    editBubbleString: '',
    editActiveBubbleIds: [],

    loading: false,
    error: '',
    msg: '',

    request: -1,
    routeAfterClose: '',
};

export function BubbleReducer(state: BubbleState = initialState, action: fromBubble.Actions) {
    switch (action.type) {
        case fromBubble.SELECT_SUGGEST_BUBBLE: case fromBubble.SELECT_SUGGEST_BUBBLE_CLEAR:
        case fromBubble.SELECT: case fromBubble.SELECT_CLEAR:
        case fromBubble.MOUSE_OVER: case fromBubble.MOUSE_OUT:
        case fromBubble.EDIT_BUBBLE_OPEN: case fromBubble.EDIT_BUBBLE_CLOSE:
            return UIReducer(state, action);

        case fromBubble.CHANGE_TITLE: case fromBubble.CHANGE_TITLE_COMPLETE: case fromBubble.CHANGE_TITLE_ERROR: case fromBubble.OTHERS_CHANGE_TITLE:
        case fromBubble.OPEN: case fromBubble.OPEN_COMPLETE: case fromBubble.OPEN_ERROR: case fromBubble.OTHERS_OPEN_DOCUMENT:
        case fromBubble.CLOSE: case fromBubble.CLOSE_COMPLETE: case fromBubble.CLOSE_ERROR: case fromBubble.OTHERS_CLOSE_DOCUMENT:
        case fromBubble.OTHERS_ADDED_AS_CONTRIBUTOR:
        case fromBubble.LOAD: case fromBubble.LOAD_COMPLETE: case fromBubble.LOAD_ERROR:
        case fromBubble.POP_BUBBLE: case fromBubble.POP_BUBBLE_COMPLETE: case fromBubble.POP_BUBBLE_ERROR: case fromBubble.OTHERS_POP_BUBBLE:
        case fromBubble.DELETE_BUBBLE: case fromBubble.DELETE_BUBBLE_COMPLETE: case fromBubble.DELETE_BUBBLE_ERROR: case fromBubble.OTHERS_DELETE_BUBBLE:
        case fromBubble.CREATE_BUBBLE: case fromBubble.CREATE_BUBBLE_COMPLETE: case fromBubble.CREATE_BUBBLE_ERROR: case fromBubble.OTHERS_CREATE_BUBBLE:
        case fromBubble.EDIT_BUBBLE: case fromBubble.EDIT_REQUEST_SUCCESS: case fromBubble.EDIT_BUBBLE_ERROR: case fromBubble.OTHERS_EDIT_REQUEST:
        case fromBubble.EDIT_UPDATE: case fromBubble.EDIT_UPDATE_SUCCESS: case fromBubble.EDIT_UPDATE_RESUME: case fromBubble.OTHERS_EDIT_UPDATE:
        case fromBubble.EDIT_COMPLETE: case fromBubble.EDIT_COMPLETE_SUCCESS: case fromBubble.OTHERS_EDIT_COMPLETE:
        case fromBubble.EDIT_DISCARD: case fromBubble.EDIT_DISCARD_SUCCESS: case fromBubble.OTHERS_EDIT_DISCARD:
        case fromBubble.FLATTEN_BUBBLE: case fromBubble.FLATTEN_BUBBLE_COMPLETE: case fromBubble.FLATTEN_BUBBLE_ERROR: case fromBubble.OTHERS_FLATTEN_BUBBLE:
        case fromBubble.WRAP_START: case fromBubble.WRAP_BUBBLE: case fromBubble.WRAP_BUBBLE_COMPLETE: case fromBubble.WRAP_BUBBLE_ERROR: case fromBubble.OTHERS_WRAP_BUBBLE:
        case fromBubble.MERGE_START: case fromBubble.MERGE_BUBBLE: case fromBubble.MERGE_BUBBLE_COMPLETE: case fromBubble.MERGE_BUBBLE_ERROR: case fromBubble.OTHERS_MERGE_BUBBLE:
        case fromBubble.SPLIT_LEAF_START: case fromBubble.SPLIT_LEAF: case fromBubble.SPLIT_LEAF_COMPLETE: case fromBubble.SPLIT_LEAF_ERROR: case fromBubble.OTHERS_SPLIT_LEAF:
        case fromBubble.MOVE_BUBBLE_START: case fromBubble.MOVE_BUBBLE: case fromBubble.MOVE_BUBBLE_COMPLETE: case fromBubble.MOVE_BUBBLE_ERROR: case fromBubble.OTHERS_MOVE_BUBBLE:
        case fromBubble.CREATE_SUGGEST_START:
        case fromBubble.CREATE_SUGGEST: case fromBubble.CREATE_SUGGEST_COMPLETE: case fromBubble.CREATE_SUGGEST_ERROR:
        case fromBubble.EDIT_SUGGEST: case fromBubble.EDIT_SUGGEST_COMPLETE: case fromBubble.EDIT_SUGGEST_ERROR:
        case fromBubble.EDIT_SUGGEST_DISCARD: case fromBubble.EDIT_SUGGEST_DISCARD_COMPLETE:
        case fromBubble.SWITCH_BUBBLE: case fromBubble.SWITCH_BUBBLE_COMPLETE: case fromBubble.SWITCH_BUBBLE_ERROR: case fromBubble.OTHERS_SWITCH_BUBBLE:
        case fromBubble.HIDE_SUGGEST: case fromBubble.HIDE_SUGGEST_COMPLETE: case fromBubble.HIDE_SUGGEST_ERROR: case fromBubble.OTHERS_HIDE_SUGGEST:
        case fromBubble.VOTE_ON_SUGGEST:
        case fromBubble.VOTE_ON_SUGGEST_COMPLETE:
        case fromBubble.VOTE_ON_SUGGEST_ERROR:
        case fromBubble.OTHERS_VOTE_ON_SUGGEST:
        case fromBubble.UNVOTE_ON_SUGGEST:
        case fromBubble.UNVOTE_ON_SUGGEST_COMPLETE:
        case fromBubble.UNVOTE_ON_SUGGEST_ERROR:
        case fromBubble.OTHERS_UNVOTE_ON_SUGGEST:
                                        
            return BubbleOperationReducer(state, action);

        case fromBubble.CLEAR_ERROR:
            return {...state, error: '' };

        case fromBubble.CLEAR_MSG:
            return {...state, msg: '' };

        // invitation
        case fromBubble.ADD_CONTRIBUTER_REQUEST:
            return {...state};
        case fromBubble.ADD_CONTRIBUTER_REQUEST_SUCCESS:
            return {...state, msg: action.payload };
        case fromBubble.ADD_CONTRIBUTER_REQUEST_FAIL:
            return {...state, error: action.payload };

        default:
            return state;
    }
}

function UIReducer(state: BubbleState, action: fromBubble.Actions) {
    const newBubbleList = _.cloneDeep(state);
    switch (action.type) {
        case fromBubble.SELECT_SUGGEST_BUBBLE: {
            const suggestBubble = action.payload;
            console.log('selectedSB', suggestBubble);
            return {...state, selectedSB: suggestBubble};
        }
        case fromBubble.SELECT_SUGGEST_BUBBLE_CLEAR: {
            console.log('selectedSB clear');
            return {...state, selectedSB: null};
        }
        case fromBubble.SELECT:
            if (state.loading) {
                return {...state, msg: 'loading...'};
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

        case fromBubble.EDIT_BUBBLE_OPEN: {
            console.log('EDIT_BUBBLE_OPEN');
            const newActiveEditBubbleList = state.editActiveBubbleIds;
            newActiveEditBubbleList.push(action.payload.id);
            return {...state, editActiveBubbleIds: [...newActiveEditBubbleList]};
        }

        case fromBubble.EDIT_BUBBLE_CLOSE: {
            console.log('EDIT_BUBBLE_CLOSE');
            let newActiveEditBubbleList = state.editActiveBubbleIds;
            const closeBubbleId = action.payload.id;
            newActiveEditBubbleList = newActiveEditBubbleList.filter(b => b !== closeBubbleId);
            return {...state, editActiveBubbleIds: [...newActiveEditBubbleList]};
        }

        default:
            console.log('this should not be called', state, action);
            return newBubbleList;
    }
}

function BubbleOperationReducer(state: BubbleState, action: fromBubble.Actions) {
    switch (action.type) {

        /****************/
        /* CHANGE TITLE */
        /****************/

        case fromBubble.CHANGE_TITLE:
            return {...state, loading: true};
        case fromBubble.CHANGE_TITLE_COMPLETE: {
            const newDoc = {...state.documentObject};
            newDoc.title = action.payload;
            return {...state, loading: false, documentObject: newDoc};
        }
        case fromBubble.CHANGE_TITLE_ERROR: {
            return {...state, loading: false, error: action.payload, documentObject: {...state.documentObject} };
        }
        case fromBubble.OTHERS_CHANGE_TITLE: {
            const newDoc = {...state.documentObject};
            newDoc.title = action.payload;
            return {...state, documentObject: newDoc};
        }
        case fromBubble.TITLE_RESET: {
            return {...state, loading: false, documentObject: {...state.documentObject}, error: 'title cannot be empty' };
        }


        /********/
        /* OPEN */
        /********/

        case fromBubble.OPEN:
            return {...initialState, loading: true};
        case fromBubble.OPEN_COMPLETE:
            return {...state, loading: false, documentObject: action.payload.documentObject,
                connectors: action.payload.connectors };
        case fromBubble.OPEN_ERROR:
            return {...state, loading: false, error: action.payload, documentObject: null};
        case fromBubble.OTHERS_OPEN_DOCUMENT:
            const addConnectors = _.cloneDeep(state.connectors);
            for (const contributor of state.documentObject.contributors) {
                if (action.payload === contributor.id) {
                    addConnectors.push(contributor);
                    return {...state, connectors: addConnectors};
                }
            }
            return {...state, error: 'cannot find new connector in contributors'};


        /*********/
        /* CLOSE */
        /*********/

        case fromBubble.CLOSE:
            return {...state, loading: true, routeAfterClose: action.payload };
        case fromBubble.CLOSE_COMPLETE:
            return {...state, loading: false, documentId: -1};
        case fromBubble.CLOSE_ERROR:
            return {...state, loading: false, error: action.payload };
        case fromBubble.OTHERS_CLOSE_DOCUMENT:
            let deleteConnectors = _.cloneDeep(state.connectors);
            deleteConnectors = deleteConnectors.filter(u => u.id !== action.payload);
            return {...state, connectors: deleteConnectors};


        /*******************/
        /* ADD CONTRIBUTOR */
        /*******************/

        case fromBubble.OTHERS_ADDED_AS_CONTRIBUTOR:
            const doc = _.cloneDeep(state.documentObject);
            doc.contributors.push(action.payload);
            return {...state, documentObject: doc};


        /********/
        /* LOAD */
        /********/

        case fromBubble.LOAD:
            return {...state, loading: true, documentId: action.payload};
        case fromBubble.LOAD_COMPLETE: {
            state.editSuggests = [];
            // state.editSuggests.push({isBindSuggest: false, bindBubbleId: 1750, content: "hello"});
            // state.editSuggests.push({isBindSuggest: true, bindBubbleId: 1765, content: "hello1"});
            return {...state, bubbleList: [...action.payload.bubbleList],
                suggestBubbleList: [...action.payload.suggestBubbleList], commentList: [...action.payload.commentList],
                noteList: [...action.payload.noteList],
                editSuggests: [...state.editSuggests],
                loading: false};
        }
        case fromBubble.LOAD_ERROR:
            return {...state, error: action.payload, loading: false, documentId: -1};

        /**********/
        /* CREATE */
        /**********/

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
        case fromBubble.OTHERS_CREATE_BUBBLE: {
            const newBubble = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            createBubble(newBubbleList, newBubble);
            return {...state, bubbleList: newBubbleList, loading: false };
        }

        /********/
        /* EDIT */
        /********/

        case fromBubble.EDIT_BUBBLE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_REQUEST_SUCCESS: {
            const bubbleId = action.payload.bubbleId;
            const userId = action.payload.userId;
            console.log(bubbleId, userId);
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.editLockHolder = userId;
            state.editActiveBubbleIds.push(bubbleId);
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList, editActiveBubbleIds: [...state.editActiveBubbleIds], loading: false};
        }
        case fromBubble.OTHERS_EDIT_REQUEST: {
            const bubbleId = action.payload.bubbleId;
            const userId = action.payload.userId;
            console.log(bubbleId, userId);
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.editLockHolder = userId;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList};
        }

        case fromBubble.EDIT_UPDATE_RESUME: {
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            console.log(bubbleId, content);
            return {...state, loading: false, editBubbleId: bubbleId, editBubbleString: content, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }

        case fromBubble.EDIT_UPDATE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_UPDATE_SUCCESS: {
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            console.log(bubbleId, content);
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.content = content;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList, loading: false, editBubbleId: bubbleId, editBubbleString: content};
        }
        case fromBubble.OTHERS_EDIT_UPDATE: {
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            console.log(bubbleId, content);
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.content = content;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList};
        }

        case fromBubble.EDIT_COMPLETE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_COMPLETE_SUCCESS: {
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            console.log(bubbleId, content);
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.content = content;
            bubble.editLockHolder = -1;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList, loading: false, editBubbleId: -1, editBubbleString: ""};
        }
        case fromBubble.OTHERS_EDIT_COMPLETE:
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            console.log(bubbleId, content);
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.content = content;
            bubble.editLockHolder = -1;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList};

        case fromBubble.EDIT_DISCARD:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_DISCARD_SUCCESS: {
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.content = content;
            bubble.editLockHolder = -1;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList, loading: false, editBubbleId: -1, editBubbleString: ""};
        }
        case fromBubble.OTHERS_EDIT_DISCARD: {
            const bubbleId = action.payload.bubbleId;
            const content = action.payload.content;
            const bubble = getBubbleById(state.bubbleList, bubbleId) as LeafBubble;
            bubble.content = content;
            bubble.editLockHolder = -1;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            return {...state, bubbleList: newBubbleList};
        }
        case fromBubble.EDIT_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};


        /*******/
        /* POP */
        /*******/

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
        case fromBubble.OTHERS_POP_BUBBLE: {
            const bubbleId = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            popBubble(newBubbleList, bubbleId);
            return {...state, bubbleList: newBubbleList, loading: false};
        }

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
        case fromBubble.OTHERS_DELETE_BUBBLE: {
            const bubbleId = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            deleteBubble(newBubbleList, bubbleId);
            return {...state, bubbleList: newBubbleList, loading: false};
        }

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
        case fromBubble.OTHERS_FLATTEN_BUBBLE: {
            const bubbleId = action.payload;
            const newLeafBubble = new LeafBubble(bubbleId);
            const newBubbleList = _.cloneDeep(state.bubbleList);
            flattenBubble(newBubbleList, bubbleId, newLeafBubble);
            return {...state, bubbleList: newBubbleList, loading: false};
        }

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
        case fromBubble.OTHERS_WRAP_BUBBLE: {
            const wrapBubbleIds = action.payload.wrapBubbleIdList;
            const newInternalBubble = action.payload.newWrappedBubble as InternalBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            wrapBubble(newBubbleList, wrapBubbleIds, newInternalBubble);
            return {...state, bubbleList: newBubbleList, loading: false, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }

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
        case fromBubble.OTHERS_MERGE_BUBBLE: {
            const mergeBubbleIds = action.payload.bubbleIdList;
            const newLeafBubble = action.payload.mergedBubble;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            mergeBubble(newBubbleList, mergeBubbleIds, newLeafBubble);
            return {...state, bubbleList: newBubbleList, loading: false, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }

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
            console.log('split_leaf_bubble');
            splitBubble(newBubbleList, bubbleId, splitBubbleList);
            return {...state, bubbleList: newBubbleList, loading: false};
        }
        case fromBubble.SPLIT_LEAF_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.OTHERS_SPLIT_LEAF: {
            const bubbleId = action.payload.bubbleId;
            const splitBubbleList = action.payload.splitBubbleObjectList;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            console.log('split_leaf_bubble');
            splitBubble(newBubbleList, bubbleId, splitBubbleList);
            return {...state, bubbleList: newBubbleList, loading: false};
        }

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
        }
        case fromBubble.MOVE_BUBBLE_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.OTHERS_MOVE_BUBBLE: {
            const bubbleId = action.payload.bubbleId;
            const newParentId = action.payload.newParentId;
            const newLocation = action.payload.newLocation;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            moveBubble(newBubbleList, bubbleId, newParentId, newLocation);
            return {...state, bubbleList: newBubbleList, loading: false};
        }

        case fromBubble.CREATE_SUGGEST_START: {
            const suggest = action.payload;
            state.editSuggests.push(suggest);
            return {...state, loading: false, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.CREATE_SUGGEST:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.CREATE_SUGGEST_COMPLETE: {
            console.log('CREATE_SUGGEST_COMPLETE', action.payload);
            const suggestBubble = action.payload.suggestBubble;
            const suggest = action.payload.suggest;
            const ind = state.editSuggests.findIndex(s => (s.bindBubbleId === suggest.bindBubbleId && s.isBindSuggest === suggest.isBindSuggest && s.content === suggest.content));
            state.editSuggests.splice(ind, 1);
            const newEditSuggests = _.cloneDeep(state.editSuggests);
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            newSuggestBubbleList.push(suggestBubble);
            return {...state, loading: false, suggestBubbleList: newSuggestBubbleList, editSuggests: newEditSuggests, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.CREATE_SUGGEST_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        case fromBubble.EDIT_SUGGEST_DISCARD: {
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.EDIT_SUGGEST_DISCARD_COMPLETE: {
            const suggest = action.payload;
            console.log(suggest);
            console.log(state.editSuggests);
            const ind = state.editSuggests.findIndex(s => (s.bindBubbleId === suggest.bindBubbleId && s.isBindSuggest === suggest.isBindSuggest && s.content === suggest.content));
            state.editSuggests.splice(ind, 1);
            const newEditSuggests = _.cloneDeep(state.editSuggests);
            return {...state, loading: false, editSuggests: newEditSuggests, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.EDIT_SUGGEST:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.EDIT_SUGGEST_COMPLETE: {
            console.log('EDIT_SUGGEST_COMPLETE', action.payload);
            const suggest = action.payload.suggest;
            const hidedSuggestBubbleId = action.payload.hidedSuggestBubbleId;
            const hidedSuggestBubble = getSuggestBubbleById(state.suggestBubbleList, hidedSuggestBubbleId);
            hidedSuggestBubble.hidden = true;
            const newEdittedSuggestBubble = action.payload.newEdittedSuggestBubble;
            const ind = state.editSuggests.findIndex(s => (s.bindBubbleId === suggest.bindBubbleId && s.isBindSuggest === suggest.isBindSuggest && s.content === suggest.content));
            state.editSuggests.splice(ind, 1);
            const newEditSuggests = _.cloneDeep(state.editSuggests);
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            newSuggestBubbleList.push(newEdittedSuggestBubble);
            return {...state, loading: false, selectedSB: newEdittedSuggestBubble, suggestBubbleList: newSuggestBubbleList, editSuggests: newEditSuggests, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.EDIT_SUGGEST_ERROR:
            return {...state, loading: false, error: action.payload, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.SWITCH_BUBBLE:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.SWITCH_BUBBLE_COMPLETE: {
            const suggestBubbleId = action.payload;
            const newBubbleList = _.cloneDeep(state.bubbleList);
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            switchBubble(newBubbleList, newSuggestBubbleList, suggestBubbleId);
            return {...state, loading: false, bubbleList: newBubbleList, suggestBubbleList: newSuggestBubbleList, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};

        }
        case fromBubble.SWITCH_BUBBLE_ERROR:
        case fromBubble.OTHERS_SWITCH_BUBBLE:

        case fromBubble.HIDE_SUGGEST:
            return {...state, loading: true, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        case fromBubble.HIDE_SUGGEST_COMPLETE:  {
            const suggestBubbleId = action.payload;
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            const suggestBubble = getSuggestBubbleById(newSuggestBubbleList, suggestBubbleId);
            suggestBubble.hidden = true;
            return {...state, loading: false, selectedSB: null, suggestBubbleList: newSuggestBubbleList, selectedBubbleList: [], selectedMenu: null, hoverBubbleList: []};
        }
        case fromBubble.HIDE_SUGGEST_ERROR:
        case fromBubble.OTHERS_HIDE_SUGGEST:
        default:
            console.log('this should not be called', state, action);
            return state;

        case fromBubble.VOTE_ON_SUGGEST:
            return {...state, loading: true};
        case fromBubble.VOTE_ON_SUGGEST_COMPLETE: {
            const suggestBubbleId = action.payload;
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            const suggestBubble = getSuggestBubbleById(newSuggestBubbleList, suggestBubbleId);
            suggestBubble.thumbUps++;
            return {...state, loading: false, suggestBubbleList: newSuggestBubbleList};
        }
        case fromBubble.VOTE_ON_SUGGEST_ERROR:
            return {...state, loading: false, error: action.payload};
        case fromBubble.OTHERS_VOTE_ON_SUGGEST: {
            const suggestBubbleId = action.payload;
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            const suggestBubble = getSuggestBubbleById(newSuggestBubbleList, suggestBubbleId);
            suggestBubble.thumbUps++;
            return {...state, suggestBubbleList: newSuggestBubbleList};
        }
 
        case fromBubble.UNVOTE_ON_SUGGEST:
            return {...state, loading: true};
        case fromBubble.UNVOTE_ON_SUGGEST_COMPLETE: {
            const suggestBubbleId = action.payload;
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            const suggestBubble = getSuggestBubbleById(newSuggestBubbleList, suggestBubbleId);
            suggestBubble.thumbUps--;
            return {...state, loading: false, suggestBubbleList: newSuggestBubbleList};
        } 
        case fromBubble.UNVOTE_ON_SUGGEST_ERROR:
            return {...state, loading: false, error: action.payload};
        case fromBubble.OTHERS_UNVOTE_ON_SUGGEST: {
            const suggestBubbleId = action.payload;
            const newSuggestBubbleList = _.cloneDeep(state.suggestBubbleList);
            const suggestBubble = getSuggestBubbleById(newSuggestBubbleList, suggestBubbleId);
            suggestBubble.thumbUps--;
            return {...state, suggestBubbleList: newSuggestBubbleList};
        }
 
 
    }
}
