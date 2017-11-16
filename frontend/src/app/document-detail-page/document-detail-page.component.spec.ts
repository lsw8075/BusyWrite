import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DocumentDetailPageComponent } from './document-detail-page.component';
import { DialogModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { DocumentService } from '../service/document.service';

class MockDocumentService {

}
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

@Component({
  selector: 'app-edit-board',
  template: `<p>mock edit board component</p>`
})
class MockEditBoardComponent {

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
          MockEditBoardComponent
        ],
        imports: [
          DialogModule,
          EditorModule,
          ButtonModule,
          FormsModule
        ],
        providers: [
          { provide: DocumentService, useClass: MockDocumentService },
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
