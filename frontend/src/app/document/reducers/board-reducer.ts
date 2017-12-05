import { Action } from '@ngrx/store';
import { Board, BoardType } from '../models/board';

import * as fromBoard from '../actions/board-action';

export interface BoardState {

    loading: boolean;
    error: string;
}

const initialState: BoardState = {

    loading: false,
    error: ''
};

export function BoardReducer(state: BoardState = initialState, action: fromBoard.Actions) {
    switch (action.type) {

    }
}
