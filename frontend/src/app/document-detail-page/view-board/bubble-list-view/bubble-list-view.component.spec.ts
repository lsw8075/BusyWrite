import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { Bubble } from '../view-board.component';
import { BubbleListViewComponent } from './bubble-list-view.component';

describe('BubbleListViewComponent', () => {
    let comp: BubbleListViewComponent;
    let fixture: ComponentFixture<BubbleListViewComponent>;

    beforeEach(() => {
        const bubbleServiceStub = {
            getBubbleById: () => ({
                then: () => ({})
            })
        };
        TestBed.configureTestingModule({
            declarations: [ BubbleListViewComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BubbleService, useValue: bubbleServiceStub },
            ]
        });
        fixture = TestBed.createComponent(BubbleListViewComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const bubbleServiceStub = fixture.debugElement.injector.get(BubbleService);
            spyOn(bubbleServiceStub, 'getBubbleById');
            comp.ngOnInit();
            expect(bubbleServiceStub.getBubbleById).toHaveBeenCalled();
        });
    });

});
