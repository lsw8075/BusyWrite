import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Bubble } from '../../../models/bubble';
import { Store, StoreModule } from '@ngrx/store';
import { BubbleListViewComponent } from './bubble-list-view.component';

import * as fromDocument from '../../../reducers/reducer';
import * as DocumentAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';
import { reducer } from '../../../reducers/reducer';
import { LeafBubble, SuggestBubble } from '../../../models/bubble';
import { Comment } from '../../../models/comment';

describe('CommentComponent', () => {
    let comp: BubbleListViewComponent;
    let fixture: ComponentFixture<BubbleListViewComponent>;

    beforeEach(() => {
        const bubbleStub = {
            id: {}
        };
        const commentStub = {};
        const storeStub = {};
        TestBed.configureTestingModule({
            declarations: [ BubbleListViewComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
            ]
            ,
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        });
        fixture = TestBed.createComponent(BubbleListViewComponent);
        comp = fixture.componentInstance;

    });

});
