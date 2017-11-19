import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BubbleService, EventBubbleService, BoardService } from '../service';
import { Bubble, MenuType, ActionType } from '../service';
import { BubbleListViewComponent } from './bubble-list-view.component';
import { Component, Input, ElementRef } from '@angular/core';
import { LeafBubble, InternalBubble } from '../../../model/bubble';
import { Board, EditItem } from '../../service';
import { ViewBoardComponent } from '../view-board.component';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

class MockBubbleService {
  getRootBubble(id: number) {}
  splitLeafBubble() {}
  popBubble() {}
  createBubble(bubble, location, content) {}
  editBubble() {}
  deleteBubble() {}
  flattenBubble() {}
  wrapBubble() {}
}

const tempBubble = new LeafBubble(0);

class MockEventBubbleService {

  private _sangjunBoardOpenEventSource = new Subject<Bubble>();
  private _splitBubbleEventSource = new Subject<Bubble>();
  private _popBubbleEventSource = new Subject<Bubble>();
  private _wrapBubbleEventSource = new Subject<Bubble>();
  private _createBubbleEventSource = new Subject<{bubble: Bubble, menu: MenuType}>();
  private _editBubbleEventSource = new Subject<Bubble>();
  private _deleteBubbleEventSource = new Subject<Bubble>();
  private _flattenBubbleEventSource = new Subject<Bubble>();

  sangjunBoardOpenEvent$ = this._sangjunBoardOpenEventSource.asObservable();
  splitBubbleEvent$ = this._splitBubbleEventSource.asObservable();
  popBubbleEvent$ = this._popBubbleEventSource.asObservable();
  wrapBubbleEvent$ = this._wrapBubbleEventSource.asObservable();
  createBubbleEvent$ = this._createBubbleEventSource.asObservable();
  editBubbleEvent$ = this._editBubbleEventSource.asObservable();
  deleteBubbleEvent$ = this._deleteBubbleEventSource.asObservable();
  flattenBubbleEvent$ = this._flattenBubbleEventSource.asObservable();

  constructor() {
  }

  clearState() {}
  setState(state) {}
  isBubbleSelected() {}
  isBeingEditted() {}
  getActionState() {}
  isMenuOpen() {}

}

class MockBoardService {
  private previewUpdateEventSource = new Subject<void>();
  private createBubbleEventSource = new Subject<EditItem>();
  private finishBubbleEditEventSource = new Subject<Bubble>();

  previewUpdateEvent$ = this.previewUpdateEventSource.asObservable();
  createBubbleEvent$ = this.createBubbleEventSource.asObservable();
  finishBubbleEditEvent$ = this.finishBubbleEditEventSource.asObservable();

  createBubble() {}


}

@Component({
  selector: 'app-bubble-detail-view',
  template: `<p>app-bubble-detail-view</p>`
})
class MockBubbleDetailViewComponent {
  @Input() bubble: Bubble;
}

@Component({
  selector: 'app-bubble-menu',
  template: `<p>app-bubble-menu component</p>`
})
class MockBubbleMenuComponent {
  @Input() bubble: Bubble;
  @Input() menu: MenuType;
}
describe('BubbleListViewComponent', () => {
    let comp: BubbleListViewComponent;
    let fixture: ComponentFixture<BubbleListViewComponent>;
    let bubbleService: BubbleService;
    let eventBubbleService: EventBubbleService;
    let boardService: BoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
              BubbleListViewComponent,
              MockBubbleDetailViewComponent,
              MockBubbleMenuComponent
            ],
            providers: [
                { provide: BubbleService, useClass: MockBubbleService },
                { provide: EventBubbleService, useClass: MockEventBubbleService },
                { provide: BoardService, useClass: MockBoardService },
                { provide: ElementRef},
            ]
        }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(BubbleListViewComponent);
      comp = fixture.componentInstance;
      bubbleService = fixture.debugElement.injector.get(BubbleService);
      eventBubbleService = fixture.debugElement.injector.get(EventBubbleService);
      boardService = fixture.debugElement.injector.get(BoardService);
      spyOn(eventBubbleService, 'clearState');
      spyOn(eventBubbleService, 'sangjunBoardOpenEvent$').and.returnValue(Observable.of(tempBubble));
      spyOn(eventBubbleService, 'splitBubbleEvent$').and.returnValue(Observable.of(tempBubble));
      spyOn(eventBubbleService, 'popBubbleEvent$').and.returnValue(Observable.of(tempBubble));
      spyOn(eventBubbleService, 'wrapBubbleEvent$').and.returnValue(Observable.of(tempBubble));
      spyOn(eventBubbleService, 'createBubbleEvent$').and.returnValue(Observable.of({bubble: tempBubble, menu: MenuType.borderBottomMenu}));
      spyOn(eventBubbleService, 'editBubbleEvent$').and.returnValue(Observable.of(tempBubble));
      spyOn(eventBubbleService, 'deleteBubbleEvent$').and.returnValue(Observable.of(tempBubble));
      spyOn(eventBubbleService, 'flattenBubbleEvent$').and.returnValue(Observable.of(tempBubble));
      spyOn(bubbleService, 'getRootBubble').and.returnValue(Promise.resolve(new InternalBubble(0, [])));
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('should create the app', () => {
      expect(comp).toBeTruthy();
    });

    it('ngOnInit makes expected calls', async(() => {
        comp.ngOnInit();
        fixture.detectChanges();
        expect(bubbleService.getRootBubble).toHaveBeenCalled();
    }));

    it('should not call clearState on click inside document', fakeAsync(() => {
      const el = fixture.elementRef.nativeElement;
      el.dispatchEvent(new MouseEvent('click'));
      el.click();
      tick();
      expect(eventBubbleService.clearState).not.toHaveBeenCalled();
    }));

    it('should call clearState outside click inside document', fakeAsync(() => {
      const el = fixture.elementRef.nativeElement;
      el.dispatchEvent(new MouseEvent('click'));
      el.click();
      tick();
      expect(eventBubbleService.clearState).not.toHaveBeenCalled();
    }));

    describe('openSangjunBoard', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'setState');
          comp.openSangjunBoard(tempBubble);
          expect(eventBubbleService.setState).toHaveBeenCalled();
          expect(eventBubbleService.clearState).toHaveBeenCalled();
      });
  });
    it('split bubble makes expected calls', fakeAsync(() => {
        spyOn(bubbleService, 'splitLeafBubble').and.callFake((): Promise<null> => {
          return Promise.resolve(null);
        });
        spyOn(eventBubbleService, 'setState');
        comp.splitBubble(tempBubble);
        tick();
        expect(bubbleService.splitLeafBubble).toHaveBeenCalled();
        expect(eventBubbleService.setState).toHaveBeenCalled();
    }));

  describe('popBubble', () => {
      it('makes expected calls', () => {
          spyOn(bubbleService, 'popBubble').and.returnValue(Promise.resolve(null));
          spyOn(eventBubbleService, 'setState');
          comp.popBubble(tempBubble);
          expect(bubbleService.popBubble).toHaveBeenCalled();
          expect(eventBubbleService.setState).toHaveBeenCalled();
      });
  });

  describe('createBubble', () => {
      it('should create bubble on top border', fakeAsync(() => {
          spyOn(bubbleService, 'createBubble').and.returnValue(Promise.resolve(tempBubble));
          spyOn(eventBubbleService, 'setState');
          spyOn(boardService, 'createBubble');
          comp.createBubble(tempBubble, MenuType.borderTopMenu);
          tick();
          expect(bubbleService.createBubble).toHaveBeenCalled();
          expect(eventBubbleService.setState).toHaveBeenCalled();
          expect(eventBubbleService.clearState).toHaveBeenCalled();
          expect(boardService.createBubble).toHaveBeenCalled();
      }));

      it('should create bubble on bottom border', fakeAsync(() => {
        spyOn(bubbleService, 'createBubble').and.returnValue(Promise.resolve(tempBubble));
        spyOn(eventBubbleService, 'setState');
        spyOn(boardService, 'createBubble');
        comp.createBubble(tempBubble, MenuType.borderBottomMenu);
        tick();
        expect(bubbleService.createBubble).toHaveBeenCalled();
        expect(eventBubbleService.setState).toHaveBeenCalled();
        expect(eventBubbleService.clearState).toHaveBeenCalled();
        expect(boardService.createBubble).toHaveBeenCalled();
    }));

      it('should throw error when not border menu', () => {
        spyOn(bubbleService, 'createBubble').and.returnValue(Promise.resolve(tempBubble));
        spyOn(eventBubbleService, 'setState');
        spyOn(boardService, 'createBubble');
        expect(function () {
          comp.createBubble(tempBubble, MenuType.internalMenu);
        }).toThrow(new Error('create bubble invoked with not border'));
    });
  });

  describe('editBubble', () => {
      it('should edit on leaf bubble', fakeAsync(() => {
          spyOn(bubbleService, 'editBubble').and.returnValue(Promise.resolve(null));
          spyOn(eventBubbleService, 'setState');
          spyOn(window, 'prompt').and.returnValue('temp');
          comp.editBubble(new LeafBubble(9));
          tick();
          expect(bubbleService.editBubble).toHaveBeenCalled();
          expect(eventBubbleService.setState).toHaveBeenCalled();
          expect(eventBubbleService.clearState).toHaveBeenCalled();
      }));

      it('should edit with empty response', fakeAsync(() => {
        spyOn(bubbleService, 'editBubble').and.returnValue(Promise.resolve(null));
        spyOn(eventBubbleService, 'setState');
        spyOn(window, 'prompt').and.returnValue('');
        comp.editBubble(new LeafBubble(9));
        tick();
        expect(bubbleService.editBubble).not.toHaveBeenCalled();
        expect(eventBubbleService.setState).not.toHaveBeenCalled();
        expect(eventBubbleService.clearState).not.toHaveBeenCalled();
    }));

      it('should not edit on internal bubble', fakeAsync(() => {
          spyOn(bubbleService, 'editBubble').and.returnValue(Promise.resolve(null));
          spyOn(eventBubbleService, 'setState');
          spyOn(window, 'prompt').and.returnValue('temp');
          comp.editBubble(new InternalBubble(9, []));
          tick();
          expect(bubbleService.editBubble).not.toHaveBeenCalled();
          expect(eventBubbleService.setState).not.toHaveBeenCalled();
          expect(eventBubbleService.clearState).not.toHaveBeenCalled();
      }));
  });

  describe('deleteBubble', () => {
      it('makes expected calls', fakeAsync(() => {
          spyOn(bubbleService, 'deleteBubble').and.returnValue(Promise.resolve(null));
          spyOn(eventBubbleService, 'setState');

          comp.deleteBubble(new LeafBubble(1));
          tick();
          expect(bubbleService.deleteBubble).toHaveBeenCalled();
          expect(eventBubbleService.setState).toHaveBeenCalled();
          expect(eventBubbleService.clearState).toHaveBeenCalled();
      }));

      it('should not delete root bubble', () => {
        spyOn(bubbleService, 'deleteBubble').and.returnValue(Promise.resolve(null));
        spyOn(eventBubbleService, 'setState');

        expect(function() {
          comp.deleteBubble(new LeafBubble(0));
        }).toThrow(new Error('Cannot delete root bubble'));

    });
  });

  describe('flattenBubble', () => {
      it('makes expected calls', fakeAsync(() => {
          spyOn(bubbleService, 'flattenBubble').and.returnValue(Promise.resolve(null));
          spyOn(eventBubbleService, 'setState');
          comp.flattenBubble(tempBubble);
          tick();
          expect(bubbleService.flattenBubble).toHaveBeenCalled();
          expect(eventBubbleService.setState).toHaveBeenCalled();
          expect(eventBubbleService.clearState).toHaveBeenCalled();
      }));
  });

  describe('setActionStyle', () => {
      it('makes expected calls', () => {
          spyOn(tempBubble, 'getHeight');
          comp.setActionStyle(tempBubble);
          expect(tempBubble.getHeight).toHaveBeenCalled();
      });


  });

  describe('setInternalBubbleStyle', () => {
      it('makes expected calls', () => {
          spyOn(tempBubble, 'getHeight');
          spyOn(eventBubbleService, 'isBubbleSelected');
          comp.setInternalBubbleStyle(tempBubble);
          expect(tempBubble.getHeight).toHaveBeenCalled();
          expect(eventBubbleService.isBubbleSelected).toHaveBeenCalled();
      });

      it('color background when bubble is selected', () => {
        spyOn(tempBubble, 'getHeight');
        spyOn(eventBubbleService, 'isBubbleSelected').and.returnValue(true);
        expect(comp.setInternalBubbleStyle(tempBubble)['background-color']).toBeDefined();
        expect(tempBubble.getHeight).toHaveBeenCalled();
        expect(eventBubbleService.isBubbleSelected).toHaveBeenCalled();
    });
  });

  describe('setLeafBubbleStyle', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'isBubbleSelected');
          spyOn(eventBubbleService, 'isBeingEditted');
          comp.setLeafBubbleStyle(tempBubble);
          expect(eventBubbleService.isBubbleSelected).toHaveBeenCalled();
          expect(eventBubbleService.isBeingEditted).toHaveBeenCalled();
      });

      it('color background when bubble is selected', () => {
          spyOn(eventBubbleService, 'isBubbleSelected').and.returnValue(true);
          spyOn(eventBubbleService, 'isBeingEditted');
          expect(comp.setLeafBubbleStyle(tempBubble['background-color'])).toBeDefined();
          expect(eventBubbleService.isBubbleSelected).toHaveBeenCalled();
          expect(eventBubbleService.isBeingEditted).toHaveBeenCalled();
      });

      it('color background when bubble is editted', () => {
        spyOn(eventBubbleService, 'isBubbleSelected');
        spyOn(eventBubbleService, 'isBeingEditted').and.returnValue(true);
        expect(comp.setLeafBubbleStyle(tempBubble['background-color'])).toBeDefined();
        expect(eventBubbleService.isBubbleSelected).toHaveBeenCalled();
        expect(eventBubbleService.isBeingEditted).toHaveBeenCalled();
    });
  });

  describe('wrapBubble', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'setState');
          comp.wrapBubble();
          expect(eventBubbleService.setState).toHaveBeenCalled();
      });
  });

  describe('wrapSelectedBubbles', () => {
      it('makes expected calls', fakeAsync(() => {
          spyOn(bubbleService, 'wrapBubble').and.returnValue(Promise.resolve(null));
          comp.wrapSelectedBubbles();
          tick();
          expect(bubbleService.wrapBubble).toHaveBeenCalled();
          expect(eventBubbleService.clearState).toHaveBeenCalled();
      }));
  });

  describe('isWrapSelected', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'getActionState');
          comp.isWrapSelected();
          expect(eventBubbleService.getActionState).toHaveBeenCalled();
      });
  });

  it('isInternal should return correctly', () => {
    expect(comp.isInternal(new LeafBubble(0))).toBeFalsy();
    expect(comp.isInternal(new InternalBubble(0, []))).toBeTruthy();
  });

  it('isBubble content shown should return correct results', () => {
    expect(comp.isBubbleContentShown(new LeafBubble(0, ''))).toBeTruthy();
    expect(comp.isBubbleContentShown(new LeafBubble(0, '', 1))).toBeTruthy();
    expect(comp.isBubbleContentShown(new LeafBubble(0, '', 2))).toBeFalsy();
  });

  it('isMenuOpen call event', () => {
    spyOn(eventBubbleService, 'isMenuOpen');
    comp.isMenuOpen(tempBubble, MenuType.internalMenu);
    expect(eventBubbleService.isMenuOpen).toHaveBeenCalled();
  });

});
