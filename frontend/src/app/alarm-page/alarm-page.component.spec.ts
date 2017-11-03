import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmPageComponent } from './alarm-page.component';

describe('AlarmPageComponent', () => {
  let component: AlarmPageComponent;
  let fixture: ComponentFixture<AlarmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
