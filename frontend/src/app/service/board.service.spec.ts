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

  it('can generate preview update event',
  inject([BoardService, BubbleService], (service: BoardService) => {
    service.updatePreview();
  }));

  it('can generate create bubble event',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    tick();
    const boardService = new BoardService(bubbleService);
    let bubble = bubbleService.getBubbleById(15);
    boardService.createBubble(bubble);
  }));

  it('can generate finish edit event',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    tick();
    const boardService = new BoardService(bubbleService);
    console.log(bubbleService.bubbleList);
    let bubble = bubbleService.getBubbleById(15);
    boardService.finishEdit(bubble, "swpp");
  }));


});
