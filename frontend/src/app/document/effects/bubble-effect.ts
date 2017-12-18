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
import * as EditBoardAction from '../actions/edit-board-action';
import * as fromDocument from '../reducers/reducer';
import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';
import { Comment } from '../models/comment';
import { Note } from '../models/note';
import { User } from '../../user/models/user';
import { MenuType } from '../services/event/event-bubble.service';
import { ViewBoardMenuType } from '../reducers/bubble-reducer';


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
            return Observable.of(new BubbleAction.OpenPending(null));
        });

    @Effect()
    openComplete$: Observable<Action> = this.action$.ofType<BubbleAction.OpenComplete>(BubbleAction.OPEN_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.Load(query.documentId));
        });

    @Effect()
    close$: Observable<Action> = this.action$.ofType<BubbleAction.Close>(BubbleAction.CLOSE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const documentId = bubbleState.documentId;
            return Observable.of(this.bubbleService.closeDocument(documentId))
                .map(() => new BubbleAction.ClosePending(null));
        });

    @Effect()
    load$: Observable<Action> = this.action$.ofType<BubbleAction.Load>(BubbleAction.LOAD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.getWholeDocument())
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
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const bubbleList = bubbleState.bubbleList;
            const bubble = getBubbleById(bubbleList, action.payload.bubbleId);
            const parentBubble = getParentBubble(bubbleList, bubble);
            let loc = bubble.location;
            if (! action.payload.isAbove) {
                loc++;
            }
            return Observable.of(this.bubbleService.createBubble(parentBubble.id, loc, "new bubble"))
                .map(() => new BubbleAction.CreateBubblePending(null));
        });

    @Effect()
    createComplete$: Observable<Action> = this.action$.ofType<BubbleAction.CreateBubbleComplete>(BubbleAction.CREATE_BUBBLE_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.EditUpdate({bubbleId: query.id, content: 'new'}));
        });

    @Effect({dispatch: false})
    editRequestSuccess$: Observable<Action> = this.action$.ofType<BubbleAction.EditRequestSuccess>(BubbleAction.EDIT_REQUEST_SUCCESS)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            return Observable.of();
        });

    @Effect()
    editUpdate$: Observable<Action> = this.action$.ofType<BubbleAction.EditUpdate>(BubbleAction.EDIT_UPDATE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.updateEdittingBubble(query.bubbleId, query.content))
                .map(() => new BubbleAction.EditUpdatePending(null));
        });

    @Effect()
    editComplete: Observable<Action> = this.action$.ofType<BubbleAction.EditComplete>(BubbleAction.EDIT_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.finishEdittingBubble(query))
                .map(() => new BubbleAction.EditCompletePending(null));
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
        });

    @Effect()
    wrap$: Observable<Action> = this.action$.ofType<BubbleAction.WrapBubble>(BubbleAction.WRAP_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const wrapBubbleList = bubbleState.selectedBubbleList.map(b => b.id);
            return Observable.of(this.bubbleService.wrapBubble(wrapBubbleList))
                .map(() => new BubbleAction.WrapBubblePending(null));
                // .map((newInternalBubble) => new BubbleAction.WrapBubbleComplete(
                //     {wrapBubbleIdList: wrapBubbleList, newWrappedBubble: newInternalBubble}))
                // .catch(err => of(new BubbleAction.WrapBubbleError(err)));
        });

    @Effect()
    merge$: Observable<Action> = this.action$.ofType<BubbleAction.MergeBubble>(BubbleAction.MERGE_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const mergeBubbleList = bubbleState.selectedBubbleList.map(b => b.id);
            return Observable.of(this.bubbleService.mergeBubble(mergeBubbleList))
                .map(() => new BubbleAction.MergeBubblePending(null));
        });

    @Effect()
    select$: Observable<Action> = this.action$.ofType<BubbleAction.Select>(BubbleAction.SELECT)
        .withLatestFrom(this._store).filter(([action, state]) =>
            ((state as any).document.bubble.viewBoardMenuType === ViewBoardMenuType.move &&
            (action.payload.menu === MenuType.borderTopMenu ||
                action.payload.menu === MenuType.borderBottomMenu)))
        .mergeMap(([action, state]) => {
            console.log('moving start', state);
            const bubbleState = (state as any).document.bubble;
            const selectedBubbleList = bubbleState.selectedBubbleList;
            const selectedMenuType = action.payload.menu;
            const bubbleId = selectedBubbleList[0].id;
            const destBubbleId = action.payload.bubble.id;
            console.log((action.payload.bubble));
            const isAbove = selectedMenuType === MenuType.borderTopMenu;
            return Observable.of(new BubbleAction.MoveBubble({
                bubbleId, destBubbleId, isAbove
            }));
        });

    @Effect()
    split$: Observable<Action> = this.action$.ofType<BubbleAction.SplitLeaf>(BubbleAction.SPLIT_LEAF)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.splitLeafBubble(query.bubbleId, query.contentList))
                .map(() => new BubbleAction.SplitLeafPending(null));
        });

    @Effect()
    flatten$: Observable<Action> = this.action$.ofType<BubbleAction.FlattenBubble>(BubbleAction.FLATTEN_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.flattenBubble(query))
                .map(() => new BubbleAction.FlattenBubblePending(null));
        });

    @Effect()
    move$: Observable<Action> = this.action$.ofType<BubbleAction.MoveBubble>(BubbleAction.MOVE_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const bubbleList = bubbleState.bubbleList;

            const bubble = getBubbleById(bubbleList, action.payload.bubbleId);
            const parentBubble = getParentBubble(bubbleList, bubble);

            const destBubble = getBubbleById(bubbleList, action.payload.destBubbleId);
            const destParentBubble = getParentBubble(bubbleList, destBubble);

            let location = destBubble.location;
            if (parentBubble.id === destParentBubble.id && bubble.location < destBubble.location) {
                location--;
            }
            if (! action.payload.isAbove) {
                location++;
            }
            return Observable.of(this.bubbleService.moveBubble(bubble.id, destParentBubble.id, location))
                .map(() => new BubbleAction.MoveBubblePending(null));
        });


    constructor(
        private action$: Actions,
        private _store: Store<fromDocument.State>,
        private bubbleService: BubbleService
    ) {}
}
