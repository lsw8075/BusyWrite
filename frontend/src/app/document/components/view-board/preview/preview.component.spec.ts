import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BoardService } from '../../../services/board.service';
import { BubbleService } from '../../../services/bubble.service';
import { Bubble } from '../../../models/bubble';
import { PreviewComponent } from './preview.component';
import { Store, StoreModule } from '@ngrx/store';

import * as fromDocument from '../../../reducers/reducer';
import * as DocumentAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';
import { reducer } from '../../../reducers/reducer';

describe('PreviewComponent', () => {
    let comp: PreviewComponent;
    let fixture: ComponentFixture<PreviewComponent>;

    beforeEach(() => {
        const boardServiceStub = {};
        const bubbleServiceStub = {};
        const bubbleStub = {
            type: {}
        };
        TestBed.configureTestingModule({
            declarations: [ PreviewComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BoardService, useValue: boardServiceStub },
                { provide: BubbleService, useValue: bubbleServiceStub },
                { provide: Bubble, useValue: bubbleStub }
            ],
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        });
        fixture = TestBed.createComponent(PreviewComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
