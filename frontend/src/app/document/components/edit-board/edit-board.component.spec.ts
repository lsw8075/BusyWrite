import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Note } from './service';
import { NoteService } from './service';
import { BoardService } from './service';
import { EditItem } from '../service';
import { EventBubbleService } from './service';
import { EditBoardComponent } from './edit-board.component';
import { LeafBubble } from '../../model/bubble';
import { DragulaModule } from 'ng2-dragula/components/dragular.module';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion/accordion.module';

import { TabViewModule } from 'primeng/primeng';
import { async } from 'q';

const noteServiceStub = {
  addNote: () => ({
      then: () => ({})
  }),
  deleteNote: () => ({
      then: () => ({})
  }),
  updateNote: () => ({
      then: () => ({})
  }),
  getNotes: () => ({
      then: () => ({})
  })
};
const boardServiceStub = {
  createBubbleEvent$: {
      subscribe: () => ({})
  },
  finishEdit: () => ({})
};

const eventBubbleServiceStub = {
  edittedBubble: {}
};

@Component({
  selector: 'app-edit-item',
  template: `<p>app-edit-item component</p>`
})
class MockBubbleMenuComponent {
  @Input() editItem: EditItem;
}

@Component({
  selector: 'app-note-view',
  template: `<p>app-edit-item component</p>`
})
class MockNoteViewComponent {
  @Input() note: Note;
}

const dragulaServiceStub = {
  setOptions: () => ({})
};

describe('EditBoardComponent', () => {
  let comp: EditBoardComponent;
  let fixture: ComponentFixture<EditBoardComponent>;
  let noteService: NoteService;
  let boardService: BoardService;
  let eventBubbleService: EventBubbleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
          EditBoardComponent,
          MockBubbleMenuComponent,
          MockNoteViewComponent
         ],
         schemas: [ NO_ERRORS_SCHEMA ],
        imports: [
          DragulaModule,
          AccordionModule,
          TabViewModule
        ],
        providers: [
            { provide: DragulaService, useValue: dragulaServiceStub },
            { provide: NoteService, useValue: noteServiceStub },
            { provide: BoardService, useValue: boardServiceStub },
            { provide: EventBubbleService, useValue: eventBubbleServiceStub }
        ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBoardComponent);
    comp = fixture.componentInstance;
    noteService = fixture.debugElement.injector.get(NoteService);
    eventBubbleService = fixture.debugElement.injector.get(EventBubbleService);
    boardService = fixture.debugElement.injector.get(BoardService);
    comp.editItems = [new EditItem(0, new LeafBubble(0)), new EditItem(0, new LeafBubble(0))];
    comp.notes = [new Note(0, 0, 0)];
  });

  it('can load instance', () => {
    expect(comp).toBeTruthy();
  });

  describe('finishEdit', () => {
    it('makes expected calls', () => {
      spyOn(boardService, 'finishEdit');
      comp.finishEdit(new EditItem(0, new LeafBubble(0)));
      expect(boardService.finishEdit).toHaveBeenCalled();
    });
  });

  describe('deleteNote', () => {
    it('makes expected calls', () => {
        spyOn(noteService, 'deleteNote').and.returnValue(Promise.resolve(new Note(9, 0, 0)));
        comp.deleteNote(new Note(0, 0, 0));
        expect(noteService.deleteNote).toHaveBeenCalled();
    });
  });

  describe('updateNote', () => {
    it('makes expected calls', () => {
        spyOn(noteService, 'updateNote').and.returnValue(Promise.resolve(new Note(9, 0, 0)));
        comp.updateNote(new Note(0, 0, 0));
        expect(noteService.updateNote).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', fakeAsync(() => {
      spyOn(comp, 'createNewEditItem');
      comp.ngOnInit();
      tick();
    }));
  });

  describe('addNote', () => {
    it('makes expected calls', () => {
      spyOn(noteService, 'addNote').and.returnValue(Promise.resolve(new Note(9, 0, 0)));
      comp.addNote();
      expect(noteService.addNote).toHaveBeenCalled();
    });
  });

  it('should create new edit item', () => {
    const newEditItem = new EditItem(10, null);
    comp.createNewEditItem(newEditItem);
    expect(comp.editItems).toContain(newEditItem);
  });

});
