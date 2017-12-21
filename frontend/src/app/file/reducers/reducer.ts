import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FileReducer, FileState } from './file-reducer';
import * as fromRoot from '../../shared/reducer';


export interface State extends fromRoot.State {
    'file': FileState;
}
export { FileReducer };

export const getFileState = createFeatureSelector<FileState>('file');

export const getFileList = createSelector(getFileState, (state: FileState) => state.fileList);
export const getSelectedFile = createSelector(getFileState, (state: FileState) => state.selectedFile);
