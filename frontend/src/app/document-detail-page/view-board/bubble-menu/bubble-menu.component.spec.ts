import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleMenuComponent } from './bubble-menu.component';

describe('BubbleMenuComponent', () => {
    let comp: BubbleMenuComponent;
    let fixture: ComponentFixture<BubbleMenuComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ BubbleMenuComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        fixture = TestBed.createComponent(BubbleMenuComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
