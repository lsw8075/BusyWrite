import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/toPromise';

import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/withLatestFrom';

import * as InvitationAction from '../actions/invitation-action';
import * as RouterAction from '../../shared/route/route-action';
import * as fromInvitation from '../reducers/reducer';

import { Http, Headers } from '@angular/http';


@Injectable()
export class InvitationEffects {

    invitationUrl = `/api/document/acceptinvitation/`;

    @Effect()
    accept$: Observable<Action> = this.action$.ofType<InvitationAction.Accept>(InvitationAction.ACCEPT)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const routerState = (state as any).router.state;
            const hash = routerState.params.hash;
            return this._http.get(`/api/document/acceptinvitation/${hash}`).map(res => {
                const status = res.status;
                if (status === 200) {
                    const jsonData = JSON.parse(res.text());
                    console.log(jsonData);
                    return new RouterAction.GoByUrl(`documents/${jsonData['document_id']}`);
                } else {
                    return new RouterAction.GoByUrl('users/signin');
                }
            });
        });


    // @Effect()
    // load$: Observable<Action> = this.action$.ofType<fromFile.Load>(fromFile.LOAD)
    //     .mergeMap(action =>
    //         this._http.get(this.documentListUrl).map(res => {
    //             const status = res.status;
    //             if (status === 200) {
    //                 const jsonData = JSON.parse(res.text());
    //                 console.log(jsonData);
    //                 return new fromFile.LoadComplete(JSON.parse(res.text()));
    //             } else if (status === 404) {
    //                 return new fromFile.LoadError(res.json());
    //             } else {
    //                 return new fromFile.LoadError('unknown error');
    //             }
    //         }));


  constructor(
    private action$: Actions,
    private _store: Store<fromInvitation.State>,
    private _http: Http
  ) {}
}
