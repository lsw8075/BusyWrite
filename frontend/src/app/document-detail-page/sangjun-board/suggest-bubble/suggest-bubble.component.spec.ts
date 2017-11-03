import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestBubbleComponent } from './suggest-bubble.component';

describe('SuggestBubbleComponent', () => {
  let component: SuggestBubbleComponent;
  let fixture: ComponentFixture<SuggestBubbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestBubbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
