import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleListViewComponent } from './bubble-list-view.component';

describe('BubbleListViewComponent', () => {
  let component: BubbleListViewComponent;
  let fixture: ComponentFixture<BubbleListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
