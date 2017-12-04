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
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/of';
import 'rxjs/observable/of';
import 'rxjs/add/observable/fromPromise';

import * as fromBubble from '../actions/bubble-action';
import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';

import { BubbleService } from '../services/bubble.service';


@Injectable()
export class BubbleEffects {


  @Effect({dispatch: false})
  open$ = this.action$.ofType<fromBubble.Open>(fromBubble.OPEN)
    .map(action => action.payload).mergeMap(query => {
        this.bubbleService.openDocument(query);
        return Observable.of({});
    });

  @Effect()
  openComplete$: Observable<Action> = this.action$.ofType<fromBubble.OpenComplete>(fromBubble.OPEN_COMPLETE)
    .map(action => action.payload).mergeMap(query => {
      return Observable.of(new fromBubble.Load(query));
    });

  @Effect()
  load$: Observable<Action> = this.action$.ofType<fromBubble.Load>(fromBubble.LOAD)
    .map(action => action.payload).mergeMap(query => {
      return Observable.of(this.bubbleService.getBubbleList())
        .map(() => new fromBubble.LoadPending(null));
    });

  @Effect()
  pop$: Observable<Action> = this.action$.ofType<fromBubble.Pop>(fromBubble.POP)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.popBubble(query))
        .map(() => new fromBubble.PopComplete(query))
        .catch(err => of(new fromBubble.PopError(err)));
    });

  @Effect()
  delete$: Observable<Action> = this.action$.ofType<fromBubble.Delete>(fromBubble.DELETE)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.deleteBubble(query))
        .map(() => new fromBubble.DeleteComplete(query))
        .catch(err => of(new fromBubble.DeleteError(err)));
    });

  @Effect()
  create$: Observable<Action> = this.action$.ofType<fromBubble.Create>(fromBubble.CREATE)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.createBubble(query.bubbleId, query.isAbove))
        .map((newBubble) => new fromBubble.CreateComplete({bubbleId: query.bubbleId, isAbove: query.isAbove, newBubble: newBubble}))
        .catch(err => of(new fromBubble.CreateError(err)));
    });

  @Effect()
  createComplete$: Observable<Action> = this.action$.ofType<fromBubble.CreateComplete>(fromBubble.CREATE_COMPLETE)
    .map(action => action.payload).mergeMap(query => {
      return Observable.of(new fromBubble.EditComplete({bubbleId: query.bubbleId, newContent: 'newly created'}));
    });

  @Effect()
  edit$: Observable<Action> = this.action$.ofType<fromBubble.Edit>(fromBubble.EDIT)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.startEdittingBubble(query))
        .map(() => new fromBubble.EditComplete({bubbleId: query, newContent: 'newly editted'}))
        .catch(err => of(new fromBubble.EditError(err)));
    });

  @Effect()
  wrap$: Observable<Action> = this.action$.ofType<fromBubble.Wrap>(fromBubble.WRAP)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.wrapBubble(query))
        .map(() => new fromBubble.WrapComplete(query))
        .catch(err => of(new fromBubble.WrapError(err)));
    });

  @Effect()
  merge$: Observable<Action> = this.action$.ofType<fromBubble.Merge>(fromBubble.MERGE)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.mergeBubble(query))
        .map(() => new fromBubble.MergeComplete(query))
        .catch(err => of(new fromBubble.MergeError(err)));
    });

  @Effect()
  split$: Observable<Action> = this.action$.ofType<fromBubble.Split>(fromBubble.SPLIT)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.splitBubble(query))
        .map(() => new fromBubble.SplitComplete(query))
        .catch(err => of(new fromBubble.SplitError(err)));
    });

  @Effect()
  flatten$: Observable<Action> = this.action$.ofType<fromBubble.Flatten>(fromBubble.FLATTEN)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.flattenBubble(query))
        .map((newBubble) => new fromBubble.FlattenComplete({bubbleId: query, newBubble: newBubble}))
        .catch(err => of(new fromBubble.FlattenError(err)));
    });


  constructor(
    private action$: Actions,
    private bubbleService: BubbleService
  ) {}
}
