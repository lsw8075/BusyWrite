import * as fromUser from '../actions/user-action';
import { User } from '../models/user';

export interface UserState {
    signedIn: boolean;
    loading: boolean;
    error: string;
    userId: number;
}

export const initialState: UserState = {
    signedIn: false,
    loading: false,
    error: '',
    // userId: 7,
   userId: -1,
};


export function UserReducer(state = initialState, action: any): UserState {
  switch (action.type) {
    case fromUser.GET_USER_INFO:
        return Object.assign({}, state, action.payload);
    case fromUser.SIGNIN:
        return {...state, loading: true};
    case fromUser.SIGNIN_SUCCESS:
        return {...state, loading: false, userId: action.payload, signedIn: true};
    case fromUser.SIGNIN_FAIL:
        return {...state, loading: false, error: action.payload};
    case fromUser.SIGNOUT:
        return {...state, loading: false, signedIn: false};
    default:
        return state;
  }
}
