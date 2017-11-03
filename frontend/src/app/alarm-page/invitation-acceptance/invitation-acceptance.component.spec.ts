import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationAcceptanceComponent } from './invitation-acceptance.component';

describe('InvitationAcceptanceComponent', () => {
  let component: InvitationAcceptanceComponent;
  let fixture: ComponentFixture<InvitationAcceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationAcceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
