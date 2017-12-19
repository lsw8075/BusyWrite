import * as fromUser from '../actions/user-action';
import { User } from '../models/user';

export interface UserState {
    signedIn: boolean;
    loading: boolean;
    error: string;
    userId: number;
}

export const initialState: UserState = {
    signedIn: true,
    loading: false,
    error: '',
    userId: 7,
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
        return {...state, loading: false, signedIn: false, userId: -1};
    case fromUser.SIGNUP:
        return {...state, loading: true};
    case fromUser.SIGNUP_SUCCESS:
        return {...state, loading: false};
    case fromUser.SIGNUP_FAIL:
        return {...state, loading: false, error: action.payload};
    case fromUser.CLEAR_ERROR:
        return {...state, error: ''};
    default:
        return state;
  }
}
