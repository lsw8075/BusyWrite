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

import * as fromBubble from '../actions/bubble.action';
import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';

import { BubbleService } from '../services/bubble.service';


@Injectable()
export class BubbleEffects {
  @Effect()
  load$: Observable<Action> = this.action$.ofType<fromBubble.Load>(fromBubble.LOAD)
    .map(action => action.payload).mergeMap(query => {
      return Observable.fromPromise(this.bubbleService.getRootBubble())
        .map((bubble: Bubble) => new fromBubble.LoadComplete(bubble))
        .catch(err => of(new fromBubble.LoadError(err)));
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
      return Observable.fromPromise(this.bubbleService.deleteBubble(query.bubble))
        .map(() => new fromBubble.CreateComplete(query))
        .catch(err => of(new fromBubble.CreateError(err)));
    });

  @Effect()
  createComplete$: Observable<Action> = this.action$.ofType<fromBubble.CreateComplete>(fromBubble.CREATE_COMPLETE)
    .map(action => action.payload).mergeMap(query => {
      return Observable.of(new fromBubble.EditComplete(query.bubble));
    });

  constructor(
    private action$: Actions,
    private bubbleService: BubbleService
  ) {}
}
