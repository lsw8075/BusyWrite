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
import {
    getBubbleById,
    getParentBubble,
    isBubbleInList,
    mouseOverBubble,
    deleteBubble, popBubble, getContent, flattenBubble, createBubble,
    editBubble, mergeBubble, wrapBubble, moveBubble, splitBubble} from '../reducers/bubble-operation';

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
                .map(() => new BubbleAction.PopPending(null));
        });

    @Effect()
    delete$: Observable<Action> = this.action$.ofType<BubbleAction.Delete>(BubbleAction.DELETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.deleteBubble(query))
                .map(() => new BubbleAction.DeletePending(null));
        });

    @Effect()
    create$: Observable<Action> = this.action$.ofType<BubbleAction.Create>(BubbleAction.CREATE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.createBubble(0, 0, "create"))
                .map(() => new BubbleAction.CreatePending(null));
                // .map((newBubble) => new BubbleAction.CreateComplete({bubbleId: query.bubbleId, isAbove: query.isAbove, newBubble: newBubble}))
                // .catch(err => of(new BubbleAction.CreateError(err)));
        });

    @Effect()
    createComplete$: Observable<Action> = this.action$.ofType<BubbleAction.CreateComplete>(BubbleAction.CREATE_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.EditUpdate(query.bubbleId));
        });

    @Effect()
    editUpdate$: Observable<Action> = this.action$.ofType<BubbleAction.EditUpdate>(BubbleAction.EDIT_UPDATE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.updateEdittingBubble(query, "updateEdittingBubble"))
                .map(() => new BubbleAction.EditUpdatePending(null));
        });

    @Effect()
    editDiscard: Observable<Action> = this.action$.ofType<BubbleAction.EditDiscard>(BubbleAction.EDIT_DISCARD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.discardEdittingBubble(query))
                .map(() => new BubbleAction.EditDiscardPending(null));
        });

    @Effect()
    edit$: Observable<Action> = this.action$.ofType<BubbleAction.Edit>(BubbleAction.EDIT)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.startEdittingBubble(query))
                .map(() => new BubbleAction.EditPending(null));
                // .map(() => new BubbleAction.EditComplete({bubbleId: query, newContent: 'newly editted'}))
                // .catch(err => of(new BubbleAction.EditError(err)));
        });

    @Effect()
    wrap$: Observable<Action> = this.action$.ofType<BubbleAction.Wrap>(BubbleAction.WRAP)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.wrapBubble(query))
                .map(() => new BubbleAction.WrapPending(null));
                // .map((newInternalBubble) => new BubbleAction.WrapComplete({wrapBubbleIds: query, newInternalBubble: newInternalBubble}))
                // .catch(err => of(new BubbleAction.WrapError(err)));
        });

    @Effect()
    merge$: Observable<Action> = this.action$.ofType<BubbleAction.Merge>(BubbleAction.MERGE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.mergeBubble(query))
                .map(() => new BubbleAction.MergePending(null));
                // .map((newBubble) => new BubbleAction.MergeComplete({mergeBubbleIds: query, newBubble: newBubble}))
                // .catch(err => of(new BubbleAction.MergeError(err)));
        });

    @Effect()
    split$: Observable<Action> = this.action$.ofType<BubbleAction.Split>(BubbleAction.SPLIT)
        .map(action => action.payload).mergeMap(query => {
            return Observable.fromPromise(this.bubbleService.splitBubble(query.bubbleId, query.contentList))
                .map(() => new BubbleAction.SplitPending(null));
                // .map((splitBubbleList) => new BubbleAction.SplitComplete({bubbleId: query.bubbleId, splitBubbleList: splitBubbleList}))
                // .catch(err => of(new BubbleAction.SplitError(err)));
        });

    @Effect()
    flatten$: Observable<Action> = this.action$.ofType<BubbleAction.Flatten>(BubbleAction.FLATTEN)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.flattenBubble(query))
                .map(() => new BubbleAction.FlattenPending(null));
                // .map((newBubble) => new BubbleAction.FlattenComplete({bubbleId: query, newBubble: newBubble}))
                // .catch(err => of(new BubbleAction.FlattenError(err)));
        });

    @Effect()
    move$: Observable<Action> = this.action$.ofType<BubbleAction.Move>(BubbleAction.MOVE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.moveBubble(query.bubbleId, 0, 0))
                .map(() => new BubbleAction.MovePending(null));
                // .map((newBubble) => new BubbleAction.MoveComplete(query))
                // .catch(err => of(new BubbleAction.MoveError(err)));
        });



    constructor(
        private action$: Actions,
        private _store: Store<fromDocument.State>,
        private bubbleService: BubbleService
    ) {}
}
