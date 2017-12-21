import { Action } from '@ngrx/store';

import * as FileModel from '../models/document';

import * as fromFile from '../actions/file-action';
import * as _ from 'lodash';

export interface FileState {
    fileList: FileModel.Document[];
    selectedFile: FileModel.Document;
    loading: boolean;
    error: string;
}

const initialState: FileState = {
    fileList: [],
    selectedFile: null,
    loading: false,
    error: ''
};

export function FileReducer(state: FileState = initialState, action: fromFile.Actions) {
    switch (action.type) {
        case fromFile.SELECT:
            return {...state, selectedFile: action.payload};
        case fromFile.LOAD:
            return {...state, loading: true};
        case fromFile.LOAD_COMPLETE:
            return {...state, fileList: action.payload, loading: false};
        case fromFile.LOAD_ERROR:
            return {...state, loading: false, error: action.payload};
        case fromFile.CREATE:
            return {...state, loading: true};
        case fromFile.CREATE_COMPLETE:
            const newFileList = _.cloneDeep(state.fileList);
            console.log('new document', action.payload);
            newFileList.push(action.payload);
            return {...state, loading: false, fileList: newFileList};
        case fromFile.CREATE_ERROR:
            return {...state, loading: false, error: action.payload};
        case fromFile.DELETE:
            return {...state, loading: true};
        case fromFile.DELETE_COMPLETE: {
            const ind = state.fileList.findIndex((file) => file.id === action.payload);
            state.fileList.splice(ind, 1);
            const newFileList = _.cloneDeep(state.fileList);
            return {...state, fileList: newFileList, loading: false};
        }
        case fromFile.DELETE_ERROR:
            return {...state, error: action.payload, loading: false};
        default:
            return state;
    }
}
