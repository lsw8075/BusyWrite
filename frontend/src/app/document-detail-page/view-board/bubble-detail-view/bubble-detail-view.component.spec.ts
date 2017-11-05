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

    it('should add background color when mouseEnter() called', () => {
      comp.mouseEnter();
      fixture.detectChanges();
      expect(comp.showStyle['background-color']).toBe('rgba(150, 150, 150, 0.1)');
    });

    it('should add background color when mouse is over element', fakeAsync(() => {
      const element = fixture.debugElement.query(By.css('.bubbleUnit')).nativeElement;
      element.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      tick();
      expect(comp.showStyle['background-color']).toBe('rgba(150, 150, 150, 0.1)');
    }));

    it('should make background transparent when mouseLeave() called', () => {
      comp.mouseLeave();
      fixture.detectChanges();
      expect(comp.showStyle['background-color']).toBe('transparent');
    });

    it('should make background transparent when mouse leaves element', fakeAsync(() => {
      const element = fixture.debugElement.query(By.css('.bubbleUnit')).nativeElement;
      element.dispatchEvent(new Event('mouseleave'));
      fixture.detectChanges();
      tick();
      expect(comp.showStyle['background-color']).toBe('transparent');
    }));

    it('should emit event when showBubbleMenuEvent is called', fakeAsync(() => {
      spyOn(comp.openMenu, 'emit');
      comp.showBubbleMenuEvent(comp.bubble);
      fixture.detectChanges();
      expect(comp.openMenu.emit).toHaveBeenCalled();
    }));

    it('should emit event when showBorderMenuEvent is called', fakeAsync(() => {
      spyOn(comp.openMenu, 'emit');
      comp.showBorderMenuEvent(comp.bubble, false);
      fixture.detectChanges();
      expect(comp.openMenu.emit).toHaveBeenCalled();
    }));

    it('should emit event when showMenuEvent is called', fakeAsync(() => {
      spyOn(comp.openMenu, 'emit');
      comp.showMenuEvent(comp.bubble);
      fixture.detectChanges();
      expect(comp.openMenu.emit).toHaveBeenCalled();
    }));

    it('should get content', () => {
      expect(comp.getContent()).toBe(mockLeafBubble.content);
    });
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

    it('should not get content, instead throw error', () => {
      expect(function() {comp.getContent()}).toThrow(new Error('this is not leaf bubble, do not have content'));
    });
  });

});

