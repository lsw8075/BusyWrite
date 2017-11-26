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
import 'rxjs/add/observable/fromPromise';

import * as fromBubble from '../actions/bubble.action';
import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../index';

import { BubbleService } from '../../../service/bubble.service';


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

  constructor(
    private action$: Actions,
    private bubbleService: BubbleService
  ) {}
}
