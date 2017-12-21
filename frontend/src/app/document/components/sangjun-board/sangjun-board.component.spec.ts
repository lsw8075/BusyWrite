import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventBubbleService } from '../../services/event/event-bubble.service';
import { EventSangjunBoardService } from '../../services/event/event-sangjun-board.service';
import { BubbleService } from '../../services/bubble.service';
import { SuggestBubbleTemp } from '../../models/bubble-temp';
import { SangjunBoardComponent } from './sangjun-board.component';

describe('SangjunBoardComponent', () => {
    let comp: SangjunBoardComponent;
    let fixture: ComponentFixture<SangjunBoardComponent>;

    beforeEach(() => {
        const eventBubbleServiceStub = {
            sangjunBoardOpenEvent$: {
                subscribe: () => ({})
            },
            clearState: () => ({})
        };
        const eventSangjunBoardServiceStub = {
            clickThumbsUp: () => ({})
        };
        const bubbleServiceStub = {};
        const suggestBubbleTempStub = {};
        TestBed.configureTestingModule({
            declarations: [ SangjunBoardComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: EventBubbleService, useValue: eventBubbleServiceStub },
                { provide: EventSangjunBoardService, useValue: eventSangjunBoardServiceStub },
                { provide: BubbleService, useValue: bubbleServiceStub },
                { provide: SuggestBubbleTemp, useValue: suggestBubbleTempStub }
            ]
        });
        fixture = TestBed.createComponent(SangjunBoardComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('isOBChecked defaults to: true', () => {
        expect(comp.isOBChecked).toEqual(true);
    });

    it('isSBChecked defaults to: true', () => {
        expect(comp.isSBChecked).toEqual(true);
    });

    it('isCommentChecked defaults to: true', () => {
        expect(comp.isCommentChecked).toEqual(true);
    });

    it('isWatching defaults to: false', () => {
        expect(comp.isWatching).toEqual(false);
    });

    describe('clickSBThumbsUp', () => {
        it('makes expected calls', () => {
            const eventSangjunBoardServiceStub: EventSangjunBoardService = fixture.debugElement.injector.get(EventSangjunBoardService);
            const suggestBubbleTempStub: SuggestBubbleTemp = fixture.debugElement.injector.get(SuggestBubbleTemp);
            spyOn(eventSangjunBoardServiceStub, 'clickThumbsUp');
            comp.clickSBThumbsUp(suggestBubbleTempStub);
            expect(eventSangjunBoardServiceStub.clickThumbsUp).toHaveBeenCalled();
        });
    });

});
