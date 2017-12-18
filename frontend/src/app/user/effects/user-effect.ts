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
import { Http, Headers } from '@angular/http';

import * as UserModel from '../models/user';
import * as fromUser from '../actions/user-action';
import * as fromRouter from '../../shared/route/route-action';
import { InjectSetupWrapper } from '@angular/core/testing';

@Injectable()
export class UserEffects {

    private signInUrl = '/api/signin';
    private signUpUrl = '/api/signup';
    private signOutUrl = '/api/signout';
    private tokenUrl = '/api/token';

    @Effect()
    signin$: Observable<Action> = this.action$.ofType<fromUser.SignIn>(fromUser.SIGNIN)
        .map(action => action.payload).mergeMap(query => {
            const headers = new Headers({'Content-Type': 'application/json'});
            return this._http
            .get(this.tokenUrl).toPromise()
            .then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
            .then(() =>  this._http.post(this.signInUrl, JSON.stringify(query), {headers: headers}).toPromise())
            .then(res => {
                const status = res.status;
                if (status === 403) {
                    return (new fromUser.SignInFail('email or password is wrong'));
                } else if (status === 200) {
                    const userId = JSON.parse(res.text()).user_id;
                    return (new fromUser.SignInSuccess(userId));
                }
            }).catch((error) => {
                console.log(query);
                return (new fromUser.SignInFail('email or password is wrong'));
            });
        });

    @Effect()
    signinSuccess$: Observable<Action> = this.action$.ofType<fromUser.SignInSuccess>(fromUser.SIGNIN_SUCCESS)
        .map(action => action.payload).mergeMap(query =>
            Observable.of(new fromRouter.GoByUrl('files'))
        );

    @Effect()
    redirectSignUp$: Observable<Action> = this.action$.ofType<fromUser.RedirectSignUp>(fromUser.REDIRECT_SIGNUP)
        .map(action => action.payload).mergeMap(query =>
            Observable.of(new fromRouter.GoByUrl('users/signup'))
        );

    @Effect()
    signup$: Observable<Action> = this.action$.ofType<fromUser.SignUp>(fromUser.SIGNUP)
        .map(action => action.payload).mergeMap(query => {
            const headers = new Headers({'Content-Type': 'application/json'});
            return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
            .then(() => this._http.post(this.signUpUrl, JSON.stringify(query), {headers: headers})
            .toPromise().then(res => res.status).then(status => {
                if (status === 403) {
                    return (new fromUser.SignUpFail('cannot sign up'));
                } else if (status === 201) {
                    return (new fromUser.SignUpSuccess(null));
                } else {
                    return (new fromUser.SignUpFail('cannot sign up'));
                }
            }));
        });

    @Effect()
    signupSuccess$: Observable<Action> = this.action$.ofType<fromUser.SignUpSuccess>(fromUser.SIGNUP_SUCCESS)
        .map(action => action.payload).mergeMap(query =>
            Observable.of(new fromRouter.GoByUrl('users/signin'))
        );

    @Effect()
    signout$: Observable<Action> = this.action$.ofType<fromUser.SignOut>(fromUser.SIGNOUT)
        .map(action => action.payload).mergeMap(query =>
            this._http.get(this.signOutUrl).toPromise().then(response => response.status).then(status => {
                return new fromRouter.GoByUrl('users/signin');
        }));

    getCookie(name) {
        const value = ';' + document.cookie;
        const parts = value.split(';' + name + '=');
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }

  constructor(
    private action$: Actions,
    private _http: Http) {}
}
