import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { Bubble } from '../view-board.component';
import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
    let comp: PreviewComponent;
    let fixture: ComponentFixture<PreviewComponent>;

    beforeEach(() => {
        const bubbleServiceStub = {
            getBubbleById: () => ({
                then: () => ({})
            })
        };
        TestBed.configureTestingModule({
            declarations: [ PreviewComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BubbleService, useValue: bubbleServiceStub },
            ]
        });
        fixture = TestBed.createComponent(PreviewComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('contentList defaults to: []', () => {
        expect(comp.contentList).toEqual([]);
    });

});
