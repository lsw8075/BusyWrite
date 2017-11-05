import { async, inject, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { BubbleService } from './bubble.service';
import { Bubble, InternalBubble, LeafBubble, BubbleType } from '../model/bubble';

const mockBubbleData = [
  { id: 0, parent_id: 0, bubble_type: 'internal', children: [ 1, 15 ]},
  { id: 1, parent_id: 0, bubble_type: 'internal', children: [ 7, 2, 3 ] },
  { id: 2, parent_id: 1, bubble_type: 'leaf', content: 'ui do' },
  { id: 3, parent_id: 1, bubble_type: 'internal', children: [ 5, 6 ] },
  { id: 5, parent_id: 3, bubble_type: 'leaf', content: 'iatur?'},
  { id: 6, parent_id: 3, bubble_type: 'leaf', content: 'Animi, id est laborum'},
  { id: 7, parent_id: 1, bubble_type: 'internal', children: [ 8, 9, 10 ]},
  { id: 9, parent_id: 7, bubble_type: 'leaf', content: 'xxdsds'},
  { id: 10, parent_id: 7, bubble_type: 'leaf', content: 'yy'},
  { id: 15, parent_id: 0, bubble_type: 'leaf', content: 'node'},
];


describe('BubbleService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BubbleService
      ]
    });
  });


  it('can instantiate service when injecting service',
  inject([BubbleService], (service: BubbleService) => {
    expect(service instanceof BubbleService).toBe(true);
  }));

  it('should be able to calculate bubble height of leaf node',
  inject([BubbleService], (service: BubbleService) => {
  }));

  it('should be able to calculate bubble height of internal node',
  inject([BubbleService], (service: BubbleService) => {
  }));

});
