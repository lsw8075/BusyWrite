import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';

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

  it('can get root bubble to access other bubble',
  async(inject([BubbleService], (service: BubbleService) => {
    service.getRootBubble().then((bubble) => {
      expect(bubble.id).toEqual(0);
    });
  })));

  it('should not get bubble by inaccessible id',
  async(inject([BubbleService], (service: BubbleService) => {
    expect(function() {service.getBubbleById(0); }).toThrowError();
  })));

  it('should be able to get bubble by accessible id',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let bubble = service.getBubbleById(4);
    expect(bubble.id).toBe(4);
  }));

  it('can create a bubble',
  async(inject([BubbleService], (service: BubbleService) => {
    service.getRootBubble().then((root) => {
      service.createBubble(root as InternalBubble, 1, 'swpp').then((bubble) => {
        expect((bubble as LeafBubble).content).toEqual('swpp');
      });
    });
  })));

  it('can edit a bubble',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let bubble = service.getBubbleById(2) as LeafBubble;
    service.editBubble(bubble, 'swpp').then(() => expect(bubble.content).toEqual('swpp'));
  }));

  it('can not edit an internal bubble',
  async(inject([BubbleService], (service: BubbleService) => {
    service.getRootBubble().then((root) => {
      expect(function() {service.editBubble(root, 'swpp') }).toThrowError();
    });
  })));

  it('can not delete the root bubble',
  async(inject([BubbleService], (service: BubbleService) => {
    service.getRootBubble().then((root) => {
      expect(function() {service.deleteBubble(root) }).toThrowError();
    });
  })));

  it('can delete a bubble',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let bubble = service.getBubbleById(4) as InternalBubble;
    service.deleteBubble(bubble).then((res) => expect(res).toBeNull());
  }));

  it('can wrap bubbles',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let b1 = service.getBubbleById(9);
    let b2 = service.getBubbleById(10);
    const wrapBubbleList = [b1, b2];
    service.wrapBubble(wrapBubbleList).then((res) => expect(res).toBeNull());
  }));

  it('can not pop the root bubble',
  async(inject([BubbleService], (service: BubbleService) => {
    service.getRootBubble().then((root) => {
      expect(function() {service.popBubble(root) }).toThrowError();
    });
  })));

  it('can pop an internal bubble',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let b1 = service.getBubbleById(8);
    service.popBubble(b1).then((res) => expect(res).toBeNull());
  }));

  it('can split a leaf bubble',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let b1 = service.getBubbleById(9) as LeafBubble;
    service.splitLeafBubble(b1, 'BusyWrite', 1).then((res) => expect(res).toBeNull());
    service.splitLeafBubble(b1, 'BusyWrite', 0).then((res) => expect(res).toBeNull());
    service.splitLeafBubble(b1, 'BusyWrite', 380).then((res) => expect(res).toBeNull());
  }));

  it('can not split when selected content not found in bubble',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let b1 = service.getBubbleById(9);
    expect(function() {service.splitLeafBubble(b1, 'swpp', 0) }).toThrowError();
  }));

  it('can not flatten the root bubble',
  async(inject([BubbleService], (service: BubbleService) => {
    service.getRootBubble().then((root) => {
      expect(function() {service.flattenBubble(root) }).toThrowError();
    });
  })));

  it('can flatten an internal bubble',
  fakeAsync(() => {
    const service = new BubbleService();
    tick();
    let b1 = service.getBubbleById(8);
    service.flattenBubble(b1).then((res) => expect(res).toBeNull());
  }));





});
