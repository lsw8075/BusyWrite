import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { EventBubbleService, ActionType, MenuType } from './event-bubble.service';
import { BubbleService } from '../bubble.service';

describe('EventBubbleService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        EventBubbleService,
      ]
    });
  }));

  it('can instantiate service when injecting service',
  inject([EventBubbleService], (service: EventBubbleService) => {
    expect(service instanceof EventBubbleService).toBe(true);
  }));

  it('can set state with new nextState',
  inject([EventBubbleService], (service: EventBubbleService) => {
    service.setState(ActionType.wrap);
    expect(service.getActionState()).toEqual(ActionType.wrap);
    service.setState(ActionType.create);
  }));

  it('can clear state',
  inject([EventBubbleService], (service: EventBubbleService) => {
    service.clearState();
    expect(service.getActionState()).toEqual(ActionType.none);
  }));

});
