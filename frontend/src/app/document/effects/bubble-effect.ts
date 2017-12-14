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
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/of';
import 'rxjs/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/withLatestFrom';


import * as BubbleAction from '../actions/bubble-action';
import * as fromDocument from '../reducers/reducer';
import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';

import { BubbleService } from '../services/bubble.service';

@Injectable()
export class BubbleEffects {

    @Effect({dispatch: false})
    open$ = this.action$.ofType<BubbleAction.Open>(BubbleAction.OPEN)
        .map(action => action.payload).mergeMap(query => {
            this.bubbleService.openDocument(query);
            return Observable.of({});
        });

    @Effect()
    openComplete$: Observable<Action> = this.action$.ofType<BubbleAction.OpenComplete>(BubbleAction.OPEN_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
        return Observable.of(new BubbleAction.Load(query));
        });

    @Effect()
    load$: Observable<Action> = this.action$.ofType<BubbleAction.Load>(BubbleAction.LOAD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.getBubbleList())
                .map(() => new BubbleAction.LoadPending(null));
        });

    @Effect()
    pop$: Observable<Action> = this.action$.ofType<BubbleAction.Pop>(BubbleAction.POP)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.popBubble(query))
                .map(() => new BubbleAction.PopComplete(query))
                .catch(err => of(new BubbleAction.PopError(err)));
        });

    @Effect()
    delete$: Observable<Action> = this.action$.ofType<BubbleAction.Delete>(BubbleAction.DELETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.deleteBubble(query))
                .map(() => new BubbleAction.DeleteComplete(query))
                .catch(err => of(new BubbleAction.DeleteError(err)));
        });

    @Effect()
    create$: Observable<Action> = this.action$.ofType<BubbleAction.Create>(BubbleAction.CREATE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.fromPromise(this.bubbleService.createBubble(query.bubbleId, query.isAbove))
                .map((newBubble) => new BubbleAction.CreateComplete(
                    {bubbleId: query.bubbleId, isAbove: query.isAbove, newBubble: newBubble}))
                .catch(err => of(new BubbleAction.CreateError(err)));
        });

    @Effect()
    createComplete$: Observable<Action> = this.action$.ofType<BubbleAction.CreateComplete>(BubbleAction.CREATE_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.EditComplete({bubbleId: query.bubbleId, newContent: 'newly created'}));
        });

    @Effect()
    edit$: Observable<Action> = this.action$.ofType<BubbleAction.Edit>(BubbleAction.EDIT)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.startEdittingBubble(query))
                .map(() => new BubbleAction.EditComplete({bubbleId: query, newContent: 'newly editted'}))
                .catch(err => of(new BubbleAction.EditError(err)));
        });

    @Effect()
    wrap$: Observable<Action> = this.action$.ofType<BubbleAction.Wrap>(BubbleAction.WRAP)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const wrapBubbleList = bubbleState.selectedBubbleList.map(b => b.id);
            return Observable.fromPromise(this.bubbleService.wrapBubble(wrapBubbleList))
                .map((newInternalBubble) => new BubbleAction.WrapComplete(
                    {wrapBubbleIds: wrapBubbleList, newInternalBubble: newInternalBubble}))
                .catch(err => of(new BubbleAction.WrapError(err)));
        });

    @Effect()
    merge$: Observable<Action> = this.action$.ofType<BubbleAction.Merge>(BubbleAction.MERGE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.fromPromise(this.bubbleService.mergeBubble(query))
                .map((newBubble) => new BubbleAction.MergeComplete({mergeBubbleIds: query, newBubble: newBubble}))
                .catch(err => of(new BubbleAction.MergeError(err)));
        });

    @Effect()
    split$: Observable<Action> = this.action$.ofType<BubbleAction.Split>(BubbleAction.SPLIT)
        .map(action => action.payload).mergeMap(query => {
            return Observable.fromPromise(this.bubbleService.splitBubble(query.bubbleId, query.contentList))
                .map((splitBubbleList) => new BubbleAction.SplitComplete({bubbleId: query.bubbleId, splitBubbleList: splitBubbleList}))
                .catch(err => of(new BubbleAction.SplitError(err)));
        });

    @Effect()
    flatten$: Observable<Action> = this.action$.ofType<BubbleAction.Flatten>(BubbleAction.FLATTEN)
        .map(action => action.payload).mergeMap(query => {
            return Observable.fromPromise(this.bubbleService.flattenBubble(query))
                .map((newBubble) => new BubbleAction.FlattenComplete({bubbleId: query, newBubble: newBubble}))
                .catch(err => of(new BubbleAction.FlattenError(err)));
        });

    @Effect()
    move$: Observable<Action> = this.action$.ofType<BubbleAction.Move>(BubbleAction.MOVE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.moveBubble(query.bubbleId, query.destBubbleId, query.isAbove))
                .map((newBubble) => new BubbleAction.MoveComplete(query))
                .catch(err => of(new BubbleAction.MoveError(err)));
        });



    constructor(
        private action$: Actions,
        private _store: Store<fromDocument.State>,
        private bubbleService: BubbleService
    ) {}
}
