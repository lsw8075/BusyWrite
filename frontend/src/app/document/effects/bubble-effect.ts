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

    @Effect({dispatch: true})
    open$: Observable<Action> = this.action$.ofType<BubbleAction.Open>(BubbleAction.OPEN)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const routerState = (state as any).router.state;
            this.bubbleService.openDocument(routerState.params.id);
            return null;
        });

    @Effect()
    openComplete$: Observable<Action> = this.action$.ofType<BubbleAction.OpenComplete>(BubbleAction.OPEN_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.Load(query.documentId));
        });

    @Effect()
    load$: Observable<Action> = this.action$.ofType<BubbleAction.Load>(BubbleAction.LOAD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.getBubbleList())
                .map(() => new BubbleAction.LoadPending(null));
        });

    @Effect()
    pop$: Observable<Action> = this.action$.ofType<BubbleAction.PopBubble>(BubbleAction.POP_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.popBubble(query))
                .map(() => new BubbleAction.PopBubblePending(null));
        });

    @Effect()
    delete$: Observable<Action> = this.action$.ofType<BubbleAction.DeleteBubble>(BubbleAction.DELETE_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.deleteBubble(query))
                .map(() => new BubbleAction.DeleteBubblePending(null));
        });

    @Effect()
    create$: Observable<Action> = this.action$.ofType<BubbleAction.CreateBubble>(BubbleAction.CREATE_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.createBubble(0, 0, "create"))
                .map(() => new BubbleAction.CreateBubblePending(null));
                // .map((newBubble) => new BubbleAction.CreateComplete({bubbleId: query.bubbleId, isAbove: query.isAbove, newBubble: newBubble}))
                // .catch(err => of(new BubbleAction.CreateError(err)));
        });

    @Effect()
    createComplete$: Observable<Action> = this.action$.ofType<BubbleAction.CreateBubbleComplete>(BubbleAction.CREATE_BUBBLE_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.EditUpdate({bubbleId: query.id, content: 'new'}));
        });

    @Effect()
    editUpdate$: Observable<Action> = this.action$.ofType<BubbleAction.EditUpdate>(BubbleAction.EDIT_UPDATE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.updateEdittingBubble(query.bubbleId, query.content))
                .map(() => new BubbleAction.EditUpdatePending(null));
        });

    @Effect()
    editDiscard: Observable<Action> = this.action$.ofType<BubbleAction.EditDiscard>(BubbleAction.EDIT_DISCARD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.discardEdittingBubble(query))
                .map(() => new BubbleAction.EditDiscardPending(null));
        });

    @Effect()
    edit$: Observable<Action> = this.action$.ofType<BubbleAction.EditBubble>(BubbleAction.EDIT_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.startEdittingBubble(query))
                .map(() => new BubbleAction.EditBubblePending(null));
                // .map(() => new BubbleAction.EditComplete({bubbleId: query, newContent: 'newly editted'}))
                // .catch(err => of(new BubbleAction.EditError(err)));
        });

    @Effect()
    wrap$: Observable<Action> = this.action$.ofType<BubbleAction.WrapBubble>(BubbleAction.WRAP_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const wrapBubbleList = bubbleState.selectedBubbleList.map(b => b.id);
            return Observable.fromPromise(this.bubbleService._wrapBubble(wrapBubbleList))
                .map((newInternalBubble) => new BubbleAction.WrapBubbleComplete(
                    {wrapBubbleIdList: wrapBubbleList, newWrappedBubble: newInternalBubble}))
                .catch(err => of(new BubbleAction.WrapBubbleError(err)));
//         .map(action => action.payload).mergeMap(query => {
//             return Observable.of(this.bubbleService.wrapBubble(query))
//                 .map(() => new BubbleAction.WrapPending(null));
        });

    @Effect()
    merge$: Observable<Action> = this.action$.ofType<BubbleAction.MergeBubble>(BubbleAction.MERGE_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const mergeBubbleList = bubbleState.selectedBubbleList.map(b => b.id);
            return Observable.fromPromise(this.bubbleService._mergeBubble(mergeBubbleList))
                .map((newBubble) => new BubbleAction.MergeBubbleComplete({bubbleIdList: mergeBubbleList, mergedBubble: newBubble}))
                .catch(err => of(new BubbleAction.MergeBubbleError(err)));
//         .map(action => action.payload).mergeMap(query => {
//             return Observable.of(this.bubbleService.mergeBubble(query))
//                 .map(() => new BubbleAction.MergePending(null));
        });

    @Effect()
    split$: Observable<Action> = this.action$.ofType<BubbleAction.SplitLeaf>(BubbleAction.SPLIT_LEAF)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.splitLeafBubble(query.bubbleId, query.contentList))
                .map(() => new BubbleAction.SplitLeafPending(null));
                // .map((splitBubbleList) => new BubbleAction.SplitComplete({bubbleId: query.bubbleId, splitBubbleList: splitBubbleList}))
                // .catch(err => of(new BubbleAction.SplitError(err)));
        });

    @Effect()
    flatten$: Observable<Action> = this.action$.ofType<BubbleAction.FlattenBubble>(BubbleAction.FLATTEN_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.flattenBubble(query))
                .map(() => new BubbleAction.FlattenBubblePending(null));
                // .map((newBubble) => new BubbleAction.FlattenComplete({bubbleId: query, newBubble: newBubble}))
                // .catch(err => of(new BubbleAction.FlattenError(err)));
        });

    @Effect()
    move$: Observable<Action> = this.action$.ofType<BubbleAction.MoveBubble>(BubbleAction.MOVE_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.moveBubble(query.bubbleId, 0, 0))
                .map(() => new BubbleAction.MoveBubblePending(null));
                // .map((newBubble) => new BubbleAction.MoveComplete(query))
                // .catch(err => of(new BubbleAction.MoveError(err)));
        });



    constructor(
        private action$: Actions,
        private _store: Store<fromDocument.State>,
        private bubbleService: BubbleService
    ) {}
}
