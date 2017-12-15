import { Action } from '@ngrx/store';
import { Bubble, BubbleType, SuggestBubble, LeafBubble, InternalBubble } from '../models/bubble';
import { Comment } from '../models/comment';

import * as fromSangjunBoard from '../actions/sangjun-bubble-action';
import * as _ from 'lodash';

export interface SangjunBubbleState {
    bubble: Bubble;
    suggestBubbles: Array<SuggestBubble>;
    comments: Array<Comment>;
    loading: boolean;
    error: string;
}

const initialState: SangjunBubbleState = {
    bubble: null,
    suggestBubbles: [],
    comments: [],
    loading: false,
    error: '',

};

export function SangjunBubbleReducer(state: SangjunBubbleState = initialState, action: fromSangjunBoard.Actions) {
    switch (action.type) {
        case fromSangjunBoard.OPEN:
            return {...state, bubble: action.payload};
        default:
            return {...state };
    }
}
