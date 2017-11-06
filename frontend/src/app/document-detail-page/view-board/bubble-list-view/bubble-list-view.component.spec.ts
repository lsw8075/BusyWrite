import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BubbleService } from '../view-board.component';
import { Bubble, LeafBubble } from '../view-board.component';
import { BubbleListViewComponent } from './bubble-list-view.component';
import { Component, Input } from '@angular/core';

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

describe('BubbleListViewComponent', () => {
    let comp: BubbleListViewComponent;
    let fixture: ComponentFixture<BubbleListViewComponent>;
    let bubbleService: BubbleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
              BubbleListViewComponent,
              MockBubbleDetailViewComponent
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
        spyOn(bubbleService, 'getBubbleById').and.returnValue(Promise.resolve(new LeafBubble()));
        comp.ngOnInit();
        expect(bubbleService.getBubbleById).toHaveBeenCalled();
    });

    it('showMenuEvent method emits event', fakeAsync(() => {
      spyOn(comp.openMenu, 'emit');
      comp.showMenuEvent({});
      tick();
      expect(comp.openMenu.emit).toHaveBeenCalled();
    }));

});
