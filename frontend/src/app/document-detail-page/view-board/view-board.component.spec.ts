import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewBoardComponent } from './view-board.component';

describe('ViewBoardComponent', () => {
    let comp: ViewBoardComponent;
    let fixture: ComponentFixture<ViewBoardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ViewBoardComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        fixture = TestBed.createComponent(ViewBoardComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
