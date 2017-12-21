import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BubbleService, EventBubbleService, BoardService } from '../service';
import { MenuType, ActionType } from '../service';
import { BubbleListViewComponent } from './bubble-list-view.component';
import { Component, Input, ElementRef } from '@angular/core';
import { LeafBubble, InternalBubble, Bubble } from '../../../models/bubble';
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
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('should create the app', () => {
      expect(comp).toBeTruthy();
    });
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

});
