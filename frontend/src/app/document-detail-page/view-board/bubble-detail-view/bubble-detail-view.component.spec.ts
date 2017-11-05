import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BubbleService } from '../view-board.component';
import { BubbleDetailViewComponent } from './bubble-detail-view.component';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../../../model/bubble';
import { Component } from '@angular/core';

class MockBubbleService {
  calcBubbleHeight(bubble: Bubble) {
    return 1;
  }
}

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
describe('BubbleDetailViewComponent', () => {
  let comp: BubbleDetailViewComponent;
  let fixture: ComponentFixture<BubbleDetailViewComponent>;
  let bubbleService: BubbleService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BubbleDetailViewComponent
      ],
      providers: [
        {provide: BubbleService, useClass: MockBubbleService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleDetailViewComponent);
    comp = fixture.componentInstance;
    bubbleService = fixture.debugElement.injector.get(BubbleService);
  });

  it('can instantiate it', () => {
    expect(comp).not.toBeNull();
  });

  it('should create the app', () => {
    expect(comp).toBeTruthy();
  });

  describe('when leaf bubble', () => {
    beforeEach(() => {
      comp.bubble = mockLeafBubble;
      fixture.detectChanges();
    });

    it('do not call getChildren on ngOnInit', () => {
      spyOn(comp, 'getChildren');
      comp.ngOnInit();
      expect(comp.getChildren).not.toHaveBeenCalled();
    });

    it('')
  });

  describe('when internal bubble', () => {
    beforeEach(() => {
      comp.bubble = mockInternalBubble;
      fixture.detectChanges();
    });

    it('do call getChildren on ngOnInit', () => {
      spyOn(comp, 'getChildren');
      comp.ngOnInit();
      expect(comp.getChildren).toHaveBeenCalled();
    });
  });

});

