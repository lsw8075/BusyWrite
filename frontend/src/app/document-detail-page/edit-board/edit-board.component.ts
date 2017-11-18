import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Note, NoteService } from './service';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {

  notes: Array<Note>;

  constructor(
    private _dragulaService: DragulaService,
    private _noteService: NoteService
  ) { }

  ngOnInit() {
    this._getNotes();
    this._dragulaService.setOptions('note-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle';
      }
    });
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

}

export { Note };
