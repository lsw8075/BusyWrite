import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BubbleService } from '../view-board.component';
import { Bubble, MenuType } from '../view-board.component';
import { BubbleListViewComponent } from './bubble-list-view.component';
import { Component, Input } from '@angular/core';
import { LeafBubble } from '../../../model/bubble';

class MockBubbleService {
  getBubbleById(id: number) {}
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
              BubbleListViewComponent,
              MockBubbleDetailViewComponent,
              MockBubbleMenuComponent
            ],
            providers: [
                { provide: BubbleService, useClass: MockBubbleService },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(BubbleListViewComponent);
      comp = fixture.componentInstance;
      bubbleService = fixture.debugElement.injector.get(BubbleService);
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('should create the app', () => {
      expect(comp).toBeTruthy();
    });

    it('ngOnInit makes expected calls', () => {
        spyOn(bubbleService, 'getBubbleById').and.returnValue(Promise.resolve(new LeafBubble(0, 0, null)));
        comp.ngOnInit();
        expect(bubbleService.getBubbleById).toHaveBeenCalled();
    });

});
