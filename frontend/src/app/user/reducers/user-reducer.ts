import * as fromUser from '../actions/user-action';
import { User } from '../models/user';

export interface UserState {
    user: User;
    loading: boolean;
    error: string;
}

export const initialState: UserState = {
    user: null,
    loading: false,
    error: '',
};

export function UserReducer(state = initialState, action: any): UserState {
  switch (action.type) {
    case fromUser.GET_USER_INFO:
        return Object.assign({}, state, action.payload);
    case fromUser.SIGNIN:
        return {...state, loading: true};
    case fromUser.SIGNIN_SUCCESS:
        return {...state, loading: false, user: action.payload};
    case fromUser.SIGNIN_FAIL:
        return {...state, loading: false, error: action.payload};
    case fromUser.SIGNOUT:
        return {...state, loading: false, user: null};
    default:
        return state;
  }
}
