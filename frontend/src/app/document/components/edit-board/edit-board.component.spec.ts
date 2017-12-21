import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Note } from './service';
import { NoteService } from './service';
import { BoardService } from './service';
import { EventBubbleService } from './service';
import { Bubble } from '../../models/bubble';
import { Suggest } from '../../models/bubble';
import { Store, StoreModule } from '@ngrx/store';
import { EditBoardComponent } from './edit-board.component';


import * as fromDocument from '../../reducers/reducer';
import * as DocumentAction from '../../actions/bubble-action';
import * as RouterAction from '../../../shared/route/route-action';
import { reducer } from '../../reducers/reducer';
import { LeafBubble, SuggestBubble } from '../../models/bubble';
import { Comment } from '../../models/comment';


describe('EditBoardComponent', () => {
    let comp: EditBoardComponent;
    let fixture: ComponentFixture<EditBoardComponent>;

    beforeEach(() => {
        const noteStub = {};
        const noteServiceStub = {};
        const boardServiceStub = {};
        const eventBubbleServiceStub = {};
        TestBed.configureTestingModule({
            declarations: [ EditBoardComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Note, useValue: noteStub },
                { provide: NoteService, useValue: noteServiceStub },
                { provide: BoardService, useValue: boardServiceStub },
                { provide: EventBubbleService, useValue: eventBubbleServiceStub },
            ],
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        });
        fixture = TestBed.createComponent(EditBoardComponent);
        comp = fixture.componentInstance;
        comp.notes = [new Note(1, 1, 1)];
    });

    // it('can load instance', () => {
    //     const storeStub = fixture.debugElement.injector.get(Store);
    //     // spyOn(storeStub, 'select').and.returnValue()
    //     expect(comp).toBeTruthy();
    // });

    // it('isFocused defaults to: false', () => {
    //     expect(comp.isFocused).toEqual(false);
    // });

    // describe('toggleIsOpen', () => {
    //     it('makes expected calls', () => {
    //         const storeStub = fixture.debugElement.injector.get(Store);
    //         spyOn(comp, 'isEditBubbleOpen');
    //         spyOn(storeStub, 'dispatch');
    //         comp.toggleIsOpen(new LeafBubble(1));
    //         expect(comp.isEditBubbleOpen).toHaveBeenCalled();
    //         expect(storeStub.dispatch).toHaveBeenCalled();
    //     });
    // });

    // describe('finishEditBubble', () => {
    //     it('makes expected calls', () => {
    //         const storeStub = fixture.debugElement.injector.get(Store);
    //         spyOn(storeStub, 'dispatch');
    //         comp.finishEditBubble(new LeafBubble(1));
    //         expect(storeStub.dispatch).toHaveBeenCalled();
    //     });
    // });

    // describe('discardEditBubble', () => {
    //     it('makes expected calls', () => {
    //         const storeStub = fixture.debugElement.injector.get(Store);
    //         spyOn(storeStub, 'dispatch');
    //         comp.discardEditBubble(new LeafBubble(1));
    //         expect(storeStub.dispatch).toHaveBeenCalled();
    //     });
    // });

    // describe('finishEditSuggest', () => {
    //     it('makes expected calls', () => {
    //         const storeStub = fixture.debugElement.injector.get(Store);
    //         spyOn(storeStub, 'dispatch');
    //         comp.finishEditSuggest(new Suggest());
    //         expect(storeStub.dispatch).toHaveBeenCalled();
    //     });
    // });

    // describe('discardEditSuggest', () => {
    //     it('makes expected calls', () => {
    //         const storeStub = fixture.debugElement.injector.get(Store);
    //         spyOn(storeStub, 'dispatch');
    //         comp.discardEditSuggest(new Suggest());
    //         expect(storeStub.dispatch).toHaveBeenCalled();
    //     });
    // });

    // describe('toBubble', () => {
    //     it('makes expected calls', () => {
    //         const noteStub: Note = fixture.debugElement.injector.get(Note);
    //         const storeStub = fixture.debugElement.injector.get(Store);
    //         spyOn(storeStub, 'dispatch');
    //         comp.toBubble(noteStub);
    //         expect(storeStub.dispatch).toHaveBeenCalled();
    //     });
    // });
});
