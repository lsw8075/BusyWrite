import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/toPromise';

import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

import * as FileModel from '../models/file-system-entity';
import * as fromFile from '../actions/file-action';
import * as fromRouter from '../../shared/route/route-action';
import { DirectoryService } from '../services/directory.service';

import { Http, Headers } from '@angular/http';


@Injectable()
export class FileEffects {

    documentListUrl = `/api/documentlist`;
    private tokenUrl = '/api/token';

    @Effect()
    load$: Observable<Action> = this.action$.ofType<fromFile.Load>(fromFile.LOAD)
        .mergeMap(action =>
            this._http.get(this.documentListUrl).map(res => {
                const status = res.status;
                if (status === 200) {
                    const jsonData = JSON.parse(res.text());
                    console.log(jsonData);
                    return new fromFile.LoadComplete(JSON.parse(res.text()));
                } else if (status === 404) {
                    return new fromFile.LoadError(res.json());
                } else {
                    return new fromFile.LoadError('unknown error');
                }
            }));

    @Effect()
    create$: Observable<Action> = this.action$.ofType<fromFile.Create>(fromFile.CREATE)
            .mergeMap(() => {
                const headers = new Headers({'Content-Type': 'application/json'});
                return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
                .then(() => this._http.post(this.documentListUrl, JSON.stringify({'title': 'new_document'}), {headers: headers})
                .toPromise().then(res => {
                    const jsonData = JSON.parse(res.text());
                    if (res.status === 200) {
                        return new fromFile.CreateComplete({
                            id: jsonData.id,
                            title: jsonData.title
                        });
                    } else {
                        return new fromFile.CreateError(jsonData);
                    }
                }));
                });

    @Effect()
    delete$: Observable<Action> = this.action$.ofType<fromFile.Delete>(fromFile.DELETE)
        .map(action => action.payload).mergeMap(query => {
            this._http.delete(this.documentListUrl).map(res => {
                console.log(res);
                const status = res.status;
                return new fromFile.DeleteComplete(1);
            });
                    // if (status === 200) {
                    //     const jsonData = JSON.parse(res.text());
                    //     console.log(jsonData);
                    //     return new fromFile.LoadComplete(JSON.parse(res.text()));
                    // } else if (status === 404) {
                    //     return new fromFile.LoadError(res.json());
                    // } else {
                    //     return new fromFile.LoadError('unknown error');
                    // }

        };

    getCookie(name) {
        const value = ';' + document.cookie;
        const parts = value.split(';' + name + '=');
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }

  constructor(
    private action$: Actions,
    private _directoryService: DirectoryService,
    private _http: Http
  ) {}
}
