import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitBubbleComponent } from './split-bubble.component';

describe('SplitBubbleComponent', () => {
  let component: SplitBubbleComponent;
  let fixture: ComponentFixture<SplitBubbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitBubbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
