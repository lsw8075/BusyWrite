import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Note, NoteService, Bubble, BoardService, EditItem } from './service';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {

  notes: Array<Note>;
  editItems: Array<EditItem>;

  constructor(
    private _dragulaService: DragulaService,
    private _noteService: NoteService,
    private _boardService: BoardService
  ) { }

  ngOnInit() {
    this._getNotes();
    this._getBubbles();
    this._dragulaService.setOptions('note-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle';
      }
    });
    this._boardService.createBubbleEvent$.subscribe((editItem: EditItem) => {
      this.createNewEditItem(editItem);
    });
  }

  public finishEdit(editItem: EditItem) {
    this._boardService.finishEdit(editItem.bubble, editItem.content);
    this.editItems = this.editItems.filter(e => e.id !== editItem.id);
  }

  public createNewEditItem(editItem: EditItem) {
    this.editItems.push(editItem);
    console.log('new item');
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

  updateNote(note: Note, changed: boolean) {
    if (changed) {
      this._noteService.updateNote(note).then(response => {
        console.log('note changed!');
      });
    }
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
