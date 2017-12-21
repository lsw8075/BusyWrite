import { Action } from '@ngrx/store';

import * as InvitationAction from '../actions/invitation-action';
import * as _ from 'lodash';

export interface InvitationState {
    loading: boolean;
    error: string;
}

const initialState: InvitationState = {
    loading: false,
    error: ''
};

export function InvitationReducer(state: InvitationState = initialState, action: InvitationAction.Actions) {
    switch (action.type) {
        default:
            return state;
    }
}
