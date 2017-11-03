import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleHierarchyViewComponent } from './bubble-hierarchy-view.component';

describe('BubbleHierarchyViewComponent', () => {
  let component: BubbleHierarchyViewComponent;
  let fixture: ComponentFixture<BubbleHierarchyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleHierarchyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleHierarchyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
