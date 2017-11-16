import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BubbleService } from '../view-board.component';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../../../model/bubble';
import { Component } from '@angular/core';
import { PreviewComponent } from './preview.component';

const mockLeafBubble = {
  id: 2,
  type: BubbleType.leafBubble,
  location: 0,
  owner: 0,
  editLock: false,
  content: 'mock leaf bubble',
  parentID: 1,
  parentBubble: null,
  suggestBubbles: null,
  comments: null,
};

const mockInternalBubble = {
  id: 1,
  type: BubbleType.internalBubble,
  location: 0,
  editLock: false,

  parentID: 0,
  parentBubble: null,
  suggestBubbles: null,
  childBubbles: [2],
  childBubbleList: [mockLeafBubble],
  comments: null
};

class MockBubbleService {
  async getBubbleById(id: number) {
    return await mockInternalBubble;
  }
}

describe('PreviewComponent', () => {
  let comp: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let bubbleService: BubbleService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewComponent
      ],
      providers: [
        {provide: BubbleService, useClass: MockBubbleService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewComponent);
    comp = fixture.componentInstance;
  });

  it('can instantiate it', () => {
    expect(comp).not.toBeNull();
  });

  // it('contentList defaults to: []', () => {
  //     expect(comp.contentList).toEqual([]);
  // });

  // it('call bubbleTraversal on ngOnInit', fakeAsync(() => {
  //   spyOn(comp, '_bubbleTraversal');
  //   comp.ngOnInit();
  //   fixture.detectChanges();
  //   tick();
  //   expect(comp._bubbleTraversal).toHaveBeenCalled();
  // }));

});
