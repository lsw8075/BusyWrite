import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuggestBubbleComponent } from './suggest-bubble.component';

import { Store, StoreModule } from '@ngrx/store';

import * as fromDocument from '../../../reducers/reducer';
import * as DocumentAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';
import { reducer } from '../../../reducers/reducer';
import { LeafBubble, SuggestBubble } from '../../../models/bubble';
import { Comment } from '../../../models/comment';

describe('SuggestBubbleComponent', () => {
    let comp: SuggestBubbleComponent;
    let fixture: ComponentFixture<SuggestBubbleComponent>;

    beforeEach(() => {
        const storeStub = {
            dispatch: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ SuggestBubbleComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Store, useValue: storeStub }
            ],
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        });
        fixture = TestBed.createComponent(SuggestBubbleComponent);
        comp = fixture.componentInstance;
        comp.bubble = new LeafBubble(1);
        comp.bubbleList = [new LeafBubble(1), new LeafBubble(2)];
        comp.suggestBubbles = [new SuggestBubble(1, '', 1)];
        comp.selectedSB = new SuggestBubble(1, '', 3);
        comp.userId = 1;
        comp.comments = [new Comment(1, '', 1, 1, 1)];
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('clickBackButton', () => {
        it('makes expected calls', () => {
            const storeStub = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'dispatch');
            comp.clickBackButton();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

    describe('clickSwitch', () => {
        it('makes expected calls', () => {
            const storeStub = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'dispatch');
            comp.clickSwitch();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

    describe('clickEdit', () => {
        it('makes expected calls', () => {
            const storeStub = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'dispatch');
            comp.clickEdit();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

    describe('clickDelete', () => {
        it('makes expected calls', () => {
            const storeStub = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'dispatch');
            comp.clickDelete();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

    describe('clickThumbsUp', () => {
        it('makes expected calls', () => {
            const storeStub = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'dispatch');
            comp.clickThumbsUp();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

});
