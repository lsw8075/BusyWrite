mport 'rxjs/add/operator/catch';
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

import * as FileModel from '../models/document';
import * as fromFile from '../actions/file-action';
import * as fromRouter from '../../shared/route/route-action';

import { Http, Headers } from '@angular/http';


@Injectable()
export class NoteEffects {

    private tokenUrl = '/api/token';

    @Effect()
    load$: Observable<Action> = this.action$.ofType<NoteAction.LoadNote>(NoteAction.LOAD)
        .map(action => action.payload).mergeMap(docid => {
            const documentUrl = `/api/${docid}/notelist`;
            return this._http.get(documentUrl).map(res => {
                const status = res.status;
                if (status == 200) {
                    const jsonData = JSON.parse(res.text());
                    console.log(jsonData);
                    return new NoteAction.LoadComplete(jsonData)
                } else {
                    return new NoteAction.LoadError('unknown error')
                }
            })});

    @Effect()
    create$: Observable<Action> = this.action$.ofType(NoteAction.CreateNote>(NoteAction.CREATE_NOTE)
        .map(action => action.payload).mergeMap((docid, content) => {
            const documentUrl = `/api/${docid}/notelist`;
            const headers = new Headers({'Content-Type': 'application/json'});
            return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
                .then(() => this._http.post(documentUrl, JSON.stringify({content: content}), {headers: headers})
                    .toPromise().then(res => {
                        console.log(res);
                        const status = res.status;
                        if (status === 200) {
                            return new NoteAction.CreateComplete();
                        } else if (status === 400) {
                            return new NoteAction.CreateError('content is empty');
                        } else {
                            return new NoteAction.CreateError('unknown error');
                        }
                    }));
            });

    @Effect()
    edit$: Observable<Action> = this.action$.ofType(NoteAction.EditNote>(NoteAction.EDIT_NOTE)
        .map(action => action.payload).mergeMap( (docid, noteid, content) => {
            const documentUrl = `/api/${docid}/note/${noteid}`;
            const headers = new Headers({'Content-Type': 'application/json'});
            return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
                .then(() => this._http.put(documentUrl, JSON.stringify({content: content}), {headers: headers})
                    .toPromise().then(res => {
                        console.log(res);
                        const status = res.status;
                        if (status === 200) {
                            return new NoteAction.EditComplete();
                        } else if (status === 400) {
                            return new NoteAction.EditError('user is not doc contributor or note owner');
                        } else {
                            return new NoteAction.EditError('unknown error');
                        }
                    }));
            });

    @Effect()
    delete$: Observable<Action> = this.action$.ofType(NoteAction.DeleteNote>(NoteAction.DELETE_NOTE)
        .map(action => action.payload).mergeMap( (docid, noteid) => {
            const documentUrl = `/api/${docid}/note/${noteid}`;
            const headers = new Headers({'Content-Type': 'application/json'});
            return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
                .then(() => this._http.delete(documentUrl, {headers: headers})
                    .toPromise().then(res => {
                        console.log(res);
                        const status = res.status;
                        if (status === 200) {
                            return new NoteAction.DeleteComplete();
                        } else if (status === 400) {
                            return new NoteAction.DeleteError('user is not doc contributor or note owner');
                        } else {
                            return new NoteAction.DeleteError('unknown error');
                        }
                    }));
            });

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
