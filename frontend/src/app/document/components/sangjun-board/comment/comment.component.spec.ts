import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Bubble } from '../../../models/bubble';
import { Store, StoreModule } from '@ngrx/store';
import { CommentComponent } from './comment.component';

import * as fromDocument from '../../../reducers/reducer';
import * as DocumentAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';
import { reducer } from '../../../reducers/reducer';
import { LeafBubble, SuggestBubble } from '../../../models/bubble';
import { Comment } from '../../../models/comment';

describe('CommentComponent', () => {
    let comp: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;

    beforeEach(() => {
        const bubbleStub = {
            id: {}
        };
        const commentStub = {};
        const storeStub = {};
        TestBed.configureTestingModule({
            declarations: [ CommentComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Bubble, useValue: bubbleStub },
                { provide: Comment, useValue: commentStub },
                { provide: Store, useValue: storeStub }
            ]
            ,
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        });
        fixture = TestBed.createComponent(CommentComponent);
        comp = fixture.componentInstance;
        comp.userId = 1;
        comp.bubbleList = [new LeafBubble(1)];
        comp.bubble = new LeafBubble(1);
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            spyOn(comp, 'getBubbleComments').and.returnValue([]);
            comp.ngOnInit();
            expect(comp.getBubbleComments).toHaveBeenCalled();
        });
    });

});
