import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { DocumentDetailPageComponent } from './document-detail-page.component';
import { DialogModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { DocumentService } from '../service/document.service';

class MockDocumentService {
  getTitle() {

  }

  setTitle() {

  }
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

@Component({
  selector: 'app-sangjun-board',
  template: `<p>mock edit board component</p>`
})
class MockSangjunBoardComponent {

}

describe('DocumentDetailPageComponent', () => {
    let comp: DocumentDetailPageComponent;
    let fixture: ComponentFixture<DocumentDetailPageComponent>;
    let documentService: DocumentService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          DocumentDetailPageComponent,
          MockViewBoardComponent,
          MockBoardManagerComponent,
          MockEditBoardComponent,
          MockSangjunBoardComponent
        ],
        imports: [
          DialogModule,
          EditorModule,
          ButtonModule,
          FormsModule,
          BrowserAnimationsModule
        ],
        providers: [
          { provide: DocumentService, useClass: MockDocumentService },
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DocumentDetailPageComponent);
      comp = fixture.componentInstance;
      documentService = fixture.debugElement.injector.get(DocumentService);
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('should create the app', () => {
      expect(comp).toBeTruthy();
    });

    it('should make expected calls on ngInit', fakeAsync(() => {
      const title = 'title';
      spyOn(documentService, 'getTitle').and.returnValue(Promise.resolve(title));
      comp.ngOnInit();
      tick();
      expect(documentService.getTitle).toHaveBeenCalled();
      expect(comp.documentTitle).toBe(title);
    }));

    describe('after onInit is called', () => {
      beforeEach( async(() => {
        const title = 'title';
        spyOn(documentService, 'getTitle').and.returnValue(Promise.resolve(title));
        comp.ngOnInit();
      }));

      it('should show edit diaglog when click on document title', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('#document_title'));
        button.nativeElement.click();
        tick();
        expect(comp.displayTitleEditDialog).toBeTruthy();
      }));

      it('should change title', () => {
        comp.documentTitle = 'newTitle';
        comp.onChangeTitleButton();
        expect(comp.documentTitle).toBe('newTitle');
      });

      it('should not change title if new title is empty', fakeAsync(() => {
        comp.documentTitle = '';
        comp.onChangeTitleButton();
        tick();
        expect(comp.documentTitle).toBe('title');
      }));

      it('should be able to cancel title change', fakeAsync(() => {
        comp.documentTitle = 'newTitle';
        comp.onCancelTitleButton();
        tick();
        expect(comp.documentTitle).toBe('title');
      }));
    });
});
