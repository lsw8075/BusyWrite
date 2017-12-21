import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleService } from './service';
import { BoardService } from '../../services/board.service';
import { EventBubbleService } from '../../services/event/event-bubble.service';
import { Store, StoreModule } from '@ngrx/store';
import { TdLoadingService } from '@covalent/core/loading/services/loading.service';
import { ViewBoardComponent } from './view-board.component';

import * as fromDocument from '../../reducers/reducer';
import * as DocumentAction from '../../actions/bubble-action';
import * as RouterAction from '../../../shared/route/route-action';
import { reducer } from '../../reducers/reducer';

import { Board, BoardType, BoardLocation } from '../../models/board';

const bubbleServiceStub = {};
const boardServiceStub = {};
const eventBubbleServiceStub = {};
const storeStub = {};
const tdLoadingServiceStub = {};


describe('ViewBoardComponent', () => {
    let comp: ViewBoardComponent;
    let fixture: ComponentFixture<ViewBoardComponent>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ ViewBoardComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BubbleService, useValue: bubbleServiceStub },
                { provide: BoardService, useValue: boardServiceStub },
                { provide: EventBubbleService, useValue: eventBubbleServiceStub },
                { provide: TdLoadingService, useValue: tdLoadingServiceStub }
            ],
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        });
        fixture = TestBed.createComponent(ViewBoardComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('can get board', () => {
        comp.board = new Board(BoardType.edit, BoardLocation.closed, 1);
        expect(comp.getBoardId()).toBe('board_1');
    });

});
