import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailPageComponent } from './document-detail-page.component';

describe('DocumentDetailPageComponent', () => {
  let component: DocumentDetailPageComponent;
  let fixture: ComponentFixture<DocumentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
