import { Action } from '@ngrx/store';
import { User } from '../models/user';

export const GET_USER_INFO = '[user] info';

export const SIGNIN = '[user] signin';
export const SIGNIN_SUCCESS = '[user] signin success';
export const SIGNIN_FAIL = '[user] signin fail';

export const SIGNOUT = '[user] signout';
export const SIGNOUT_SUCCESS = '[user] signout success';
export const SIGNOUT_FAIL = '[user] signout fail';

export const REDIRECT_SIGNUP = '[user] redirect to signup page';
export const SIGNUP = '[user] signup';
export const SIGNUP_SUCCESS = '[user] signup success';
export const SIGNUP_FAIL = '[user] signup fail';

export class GetUserInfo implements Action {
  readonly type = GET_USER_INFO;

  constructor(public payload ?: any) {
  }
}

export class SignIn implements Action {
    readonly type = SIGNIN;
    constructor(public payload: {
        username: string,
        password: string
    }) {}
}

export class SignInSuccess implements Action {
    readonly type = SIGNIN_SUCCESS;
    constructor(public payload: User) {}
}

export class SignInFail implements Action {
    readonly type = SIGNIN_FAIL;
    constructor(public payload: string) {}
}

export class RedirectSignUp implements Action {
    readonly type = REDIRECT_SIGNUP;
    constructor(public payload ?: void) {}
}

export class SignUp implements Action {
    readonly type = SIGNUP;
    constructor(public payload: {
        name: string,
        username: string,
        password: string}) {}
}

export class SignUpSuccess implements Action {
    readonly type = SIGNUP_SUCCESS;
    constructor(public payload: User) {}
}

export class SignUpFail implements Action {
    readonly type = SIGNUP_FAIL;
    constructor(public payload: string) {}
}

export class SignOut implements Action {
    readonly type = SIGNOUT;
    constructor(public payload ?: void) {}
}

export class SignOutSuccess implements Action {
    readonly type = SIGNOUT_SUCCESS;
    constructor(public payload ?: void) {}
}

export class SignOutFail implements Action {
    readonly type = SIGNOUT_FAIL;
    constructor(public payload: string) {}
}

export type Actions =
    | GetUserInfo
    | SignIn
    | SignInSuccess
    | SignInFail
    | SignUp
    | SignUpSuccess
    | SignUpFail
    | SignOut
    | SignOutSuccess
    | SignOutFail;
