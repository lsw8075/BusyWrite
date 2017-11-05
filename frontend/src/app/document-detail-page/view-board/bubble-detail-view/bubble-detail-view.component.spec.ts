import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { BubbleDetailViewComponent } from './bubble-detail-view.component';

describe('BubbleDetailViewComponent', () => {
    let comp: BubbleDetailViewComponent;
    let fixture: ComponentFixture<BubbleDetailViewComponent>;

    beforeEach(() => {
        const bubbleServiceStub = {
            calcBubbleHeight: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ BubbleDetailViewComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BubbleService, useValue: bubbleServiceStub }
            ]
        });
        fixture = TestBed.createComponent(BubbleDetailViewComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
