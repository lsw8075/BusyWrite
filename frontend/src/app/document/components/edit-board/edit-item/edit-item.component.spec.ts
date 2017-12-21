import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditItemComponent } from './edit-item.component';

describe('EditItemComponent', () => {
    let comp: EditItemComponent;
    let fixture: ComponentFixture<EditItemComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ EditItemComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        fixture = TestBed.createComponent(EditItemComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
