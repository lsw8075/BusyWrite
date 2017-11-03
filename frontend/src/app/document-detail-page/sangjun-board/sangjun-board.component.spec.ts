import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SangjunBoardComponent } from './sangjun-board.component';

describe('SangjunBoardComponent', () => {
  let component: SangjunBoardComponent;
  let fixture: ComponentFixture<SangjunBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SangjunBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SangjunBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
