import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DocumentDetailPageComponent } from './document-detail-page.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-board',
  template: `<p>mock view board component</p>`
})
class MockViewBoardComponent {

}

@Component({
  selector: 'app-board-manager',
  template: `<p>mock board manager component</p>`
})
class MockBoardManagerComponent {

}

describe('DocumentDetailPageComponent', () => {
    let comp: DocumentDetailPageComponent;
    let fixture: ComponentFixture<DocumentDetailPageComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          DocumentDetailPageComponent,
          MockViewBoardComponent,
          MockBoardManagerComponent,
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DocumentDetailPageComponent);
      comp = fixture.componentInstance;
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('should create the app', () => {
      expect(comp).toBeTruthy();
    });

});
