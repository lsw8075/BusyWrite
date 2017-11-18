import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ViewBoardComponent } from './view-board.component';
import { BubbleService } from './service';
import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/primeng';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';

@Component({
  selector: 'app-bubble-list-view',
  template: `<p>app-bubble-list-view component</p>`
})
class MockBubbleListViewComponent {

}

@Component({
  selector: 'app-bubble-menu',
  template: `<p>app-bubble-menu component</p>`
})
class MockBubbleMenuComponent {
  showMenu(item) {}
}


@Component({
  selector: 'app-preview',
  template: `<p>app-bubble-menu component</p>`
})
class MockPreviewComponent {

}

class MockBubbleService {

}

describe('ViewBoardComponent', () => {
  let comp: ViewBoardComponent;
  let fixture: ComponentFixture<ViewBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewBoardComponent,
        MockBubbleListViewComponent,
        MockPreviewComponent,
        MockBubbleMenuComponent
      ],
      imports: [
        TabViewModule
      ],
      providers: [
        { provide: BubbleService, useClass: MockBubbleService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBoardComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can instantiate it', () => {
    expect(comp).not.toBeNull();
  });

  it('should create the app', () => {
    expect(comp).toBeTruthy();
  });

});
