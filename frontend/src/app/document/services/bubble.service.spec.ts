import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { BubbleService } from './bubble.service';
import { Bubble, InternalBubble, LeafBubble } from '../models/bubble';

describe('BubbleService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        BubbleService
      ]
    });
  }));

  it('can instantiate service when injecting service',
  inject([BubbleService], (service: BubbleService) => {
    expect(service instanceof BubbleService).toBe(true);
  }));



  it('should not get bubble by inaccessible id',
  async(inject([BubbleService], (service: BubbleService) => {
    expect(function() {service.getBubbleById(0); }).toThrowError();
  })));

});
