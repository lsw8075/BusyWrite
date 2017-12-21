import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoteViewComponent } from './note-view.component';

describe('NoteViewComponent', () => {
    let comp: NoteViewComponent;
    let fixture: ComponentFixture<NoteViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ NoteViewComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        fixture = TestBed.createComponent(NoteViewComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
