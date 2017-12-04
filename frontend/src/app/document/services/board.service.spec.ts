import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { BoardService } from './board.service';
import { BubbleService } from './bubble.service';

describe('BoardService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        BoardService,
        BubbleService
      ]
    });
  }));

  it('can instantiate service when injecting service',
  inject([BoardService, BubbleService], (service: BoardService) => {
    expect(service instanceof BoardService).toBe(true);
  }));

});
