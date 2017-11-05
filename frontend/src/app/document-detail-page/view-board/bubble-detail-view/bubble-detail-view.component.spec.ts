import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleDetailViewComponent } from './bubble-detail-view.component';

describe('BubbleDetailViewComponent', () => {
  let component: BubbleDetailViewComponent;
  let fixture: ComponentFixture<BubbleDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
