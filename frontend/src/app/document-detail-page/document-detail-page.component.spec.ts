import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DocumentDetailPageComponent } from './document-detail-page.component';

describe('DocumentDetailPageComponent', () => {
    let comp: DocumentDetailPageComponent;
    let fixture: ComponentFixture<DocumentDetailPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ DocumentDetailPageComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        fixture = TestBed.createComponent(DocumentDetailPageComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
