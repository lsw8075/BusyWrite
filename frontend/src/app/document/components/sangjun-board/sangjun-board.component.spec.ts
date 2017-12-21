import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventBubbleService } from '../../services/event/event-bubble.service';
import { BubbleService } from '../../services/bubble.service';
import { Bubble, LeafBubble } from '../../models/bubble';
import { SuggestBubble } from '../../models/bubble';
import { SangjunBoardComponent } from './sangjun-board.component';

import { Store, StoreModule } from '@ngrx/store';

import * as fromDocument from '../../reducers/reducer';
import * as DocumentAction from '../../actions/bubble-action';
import * as RouterAction from '../../../shared/route/route-action';
import { reducer } from '../../reducers/reducer';

describe('SangjunBoardComponent', () => {
    let comp: SangjunBoardComponent;
    let fixture: ComponentFixture<SangjunBoardComponent>;

    beforeEach(() => {
        const eventBubbleServiceStub = {};
        const bubbleServiceStub = {};
        const bubbleStub = {
            id: {}
        };
        const suggestBubbleStub = {
            thumbUps: {}
        };
        const storeStub = {
            dispatch: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ SangjunBoardComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: EventBubbleService, useValue: eventBubbleServiceStub },
                { provide: BubbleService, useValue: bubbleServiceStub },
                { provide: Bubble, useValue: bubbleStub },
                { provide: SuggestBubble, useValue: suggestBubbleStub },
                { provide: Store, useValue: storeStub }
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

    describe('clickSuggestBubble', () => {
        it('makes expected calls', () => {
            const suggestBubbleStub: SuggestBubble = fixture.debugElement.injector.get(SuggestBubble);
            const storeStub = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'dispatch');
            comp.clickSuggestBubble(suggestBubbleStub);
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

    describe('createSuggestBubble', () => {
        it('makes expected calls', () => {
            const storeStub = fixture.debugElement.injector.get(Store);
            comp.bubble = new LeafBubble(1);
            spyOn(comp, 'getContentOfBubble');
            spyOn(storeStub, 'dispatch');
            comp.createSuggestBubble();
            expect(comp.getContentOfBubble).toHaveBeenCalled();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

});
