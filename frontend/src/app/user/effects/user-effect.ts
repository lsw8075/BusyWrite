import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import * as UserModel from '../models/user';
import * as fromUser from '../actions/user-action';
import * as fromRouter from '../../shared/route/route-action';
import { InjectSetupWrapper } from '@angular/core/testing';

@Injectable()
export class UserEffects {
    @Effect()
    signin$: Observable<Action> = this.action$.ofType<fromUser.SignIn>(fromUser.SIGNIN)
        .map(action => action.payload).mergeMap(query => {
            const tempUser: UserModel.User = new UserModel.User(1, 'swpp@snu.ac.kr', 'iluvswpp');
            console.log('signin');
            return Observable.of(new fromUser.SignInSuccess(tempUser));
    });

    @Effect()
    signinSuccess$: Observable<Action> = this.action$.ofType<fromUser.SignInSuccess>(fromUser.SIGNIN_SUCCESS)
        .map(action => action.payload).mergeMap(query =>
            Observable.of(new fromRouter.GoByUrl('documents'))
        );

    @Effect()
    redirectSignUp$: Observable<Action> = this.action$.ofType<fromUser.RedirectSignUp>(fromUser.REDIRECT_SIGNUP)
        .map(action => action.payload).mergeMap(query =>
            Observable.of(new fromRouter.GoByUrl('users/signup'))
        );

    @Effect()
    signup$: Observable<Action> = this.action$.ofType<fromUser.SignUp>(fromUser.SIGNUP)
        .map(action => action.payload).mergeMap(query =>
            Observable.of(new fromRouter.GoByUrl('users/signin'))
        );

    @Effect()
    signout$: Observable<Action> = this.action$.ofType<fromUser.SignOut>(fromUser.SIGNOUT)
        .map(action => action.payload).mergeMap(query =>
            Observable.of(new fromRouter.GoByUrl('users/signin'))
        );

  constructor(
    private action$: Actions) {}
}
