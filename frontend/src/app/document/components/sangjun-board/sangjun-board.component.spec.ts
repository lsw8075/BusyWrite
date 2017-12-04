import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventBubbleService } from '../../services/event/event-bubble.service';
import { BubbleService } from '../../services/bubble.service';
import { SangjunBoardComponent } from './sangjun-board.component';

describe('SangjunBoardComponent', () => {
    let comp: SangjunBoardComponent;
    let fixture: ComponentFixture<SangjunBoardComponent>;

    beforeEach(() => {
        const eventBubbleServiceStub = {
            sangjunBoardOpenEvent$: {
                subscribe: () => ({})
            }
        };
        const bubbleServiceStub = {};
        TestBed.configureTestingModule({
            declarations: [ SangjunBoardComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: EventBubbleService, useValue: eventBubbleServiceStub },
                { provide: BubbleService, useValue: bubbleServiceStub }
            ]
        });
        fixture = TestBed.createComponent(SangjunBoardComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('isSBChecked defaults to: true', () => {
        expect(comp.isSBChecked).toEqual(true);
    });

    it('isCommentChecked defaults to: true', () => {
        expect(comp.isCommentChecked).toEqual(true);
    });

});
