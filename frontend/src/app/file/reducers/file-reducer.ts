import { Action } from '@ngrx/store';

import * as FileModel from '../models/file-system-entity';

import * as fromFile from '../actions/file-action';

export interface FileState {
    fileList: FileModel.FileSystemEntity[];
    selectedFile: FileModel.FileSystemEntity;
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
            return {...state, error: action.payload};
        default:
            return state;
    }
}
