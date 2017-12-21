import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Bubble } from '../../models/bubble';
import { Store, StoreModule } from '@ngrx/store';
import { BoardManagerComponent } from './board-manager.component';

import * as fromDocument from '../../reducers/reducer';
import * as DocumentAction from '../../actions/bubble-action';
import * as RouterAction from '../../../shared/route/route-action';
import { reducer } from '../../reducers/reducer';
import { LeafBubble, SuggestBubble } from '../../models/bubble';
import { Comment } from '../../models/comment';
import { Board, BoardType, BoardLocation } from '../../models/board';

import { BoardReducer, BoardState } from '../../reducers/board-reducer';


const boardList = [
    new Board(BoardType.edit, BoardLocation.left, 1),
    new Board(BoardType.edit, BoardLocation.right, 2),
];

const state: BoardState = {
    newId: 1,
    boardList: boardList,
    activeBoard: boardList[0],
    loading: false,
    error: ''
};
describe('CommentComponent', () => {
    let comp: BoardManagerComponent;
    let fixture: ComponentFixture<BoardManagerComponent>;
    let store: Store<fromDocument.State>;
    let dispatchSpy;

    beforeEach( async(() => {
        const bubbleStub = {
            id: {}
        };
        const commentStub = {};
        const storeStub = {};
        TestBed.configureTestingModule({
            declarations: [ BoardManagerComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
            ]
            ,
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(BoardManagerComponent);
            comp = fixture.componentInstance;
            store = fixture.debugElement.injector.get(Store);
            dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
            spyOn(store, 'select').and.callFake((err) => {
                console.error('select spy', err);
            });
            spyOn(fromDocument, 'getBoardState').and.callThrough();
            spyOn(fromDocument, 'getBoardList').and.returnValue(boardList);
            spyOn(fromDocument, 'getLeftBoard').and.returnValue(boardList[0]);
            spyOn(fromDocument, 'getRightBoard').and.returnValue(boardList[1]);
        });
    }));
});
