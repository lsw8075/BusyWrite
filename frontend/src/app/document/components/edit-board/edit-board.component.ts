import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Note, NoteService, Bubble, BoardService, EditItem } from './service';
import { EventBubbleService } from './service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css', '../board-style.css']
})
export class EditBoardComponent implements OnInit, OnDestroy {

  notes: Array<Note>;
  editItems: Array<EditItem>;

  constructor(
    private _dragulaService: DragulaService,
    private _noteService: NoteService,
    private _boardService: BoardService,
    private _eventBubbleService: EventBubbleService) {
  }

  ngOnInit() {
    this._getNotes();
    this._getBubbles();
    this._dragulaService.setOptions('note-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle';
      }
    });
  /*  this._boardService.createBubbleEvent$.subscribe((editItem: EditItem) => {
      this.createNewEditItem(editItem);
    });
    this._boardService.getEditBubbles();*/
  }

  public finishEdit(editItem: EditItem) {
//    this._boardService.finishEdit(editItem.bubble, editItem.content);
    this.editItems = this.editItems.filter(e => e.id !== editItem.id);
  }

  public createNewEditItem(editItem: EditItem) {
    this.editItems.push(editItem);
    console.log('new item');
  }

  public focusEditItem(editItem: EditItem, focused: boolean) {
    // this._eventBubbleService.edittedBubble = (focused) ? editItem.bubble : null;
  }

  public updateEditItem(editItem: EditItem) {
//    this._boardService.updateEdit(editItem.bubble, editItem.content);
  }

  addNote() {
    this._noteService.addNote()
      .then(note => {
        this.notes.push(note);
      });
  }

  deleteNote(note: Note) {
    this._noteService.deleteNote(note)
      .then(response => {
        this.notes = this.notes.filter(n => n.id !== note.id);
      });
  }

  updateNote(note: Note) {
    this._noteService.updateNote(note).then(response => {
      console.log('note changed!');
    });
  }

  ngOnDestroy() {
    this._dragulaService.destroy('note-bag');
  }

  public toComment(note: Note) {
    console.log('tocomment');
  }

  public toBubble(note: Note) {

  }

  private _getNotes(): void {
    this._noteService.getNotes(1)
      .then(notes => {
        this.notes = notes;
      });
  }
  private _getBubbles(): void {
    this.editItems = [];
  }

}

export { Note };
