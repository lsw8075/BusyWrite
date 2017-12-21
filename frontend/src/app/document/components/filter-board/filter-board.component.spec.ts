import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterBoardComponent } from './filter-board.component';
import { LeafBubble } from '../../models/bubble';

describe('FilterBoardComponent', () => {
    let comp: FilterBoardComponent;
    let fixture: ComponentFixture<FilterBoardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ FilterBoardComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        fixture = TestBed.createComponent(FilterBoardComponent);
        comp = fixture.componentInstance;
        comp.bubbleList = [new LeafBubble(1, 'hi'), new LeafBubble(1, 'not')];
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('get filtered result', () => {
        comp.searchKeyword = 'hi';
        expect(comp.getFilteredResults()).toEqual([ '<mark>hi</mark>' ]);
    });

});
