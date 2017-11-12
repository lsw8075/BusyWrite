import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Note, NoteService } from '../document-detail-page.component';

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

  private _getNotes(): void {
    this._noteService.getNotes(1)
      .then(notes => {
        this.notes = notes;
      });
  }

  getSummary(note: Note): string {
    if (note.content) {
      const summary = note.content.slice(0, 30);
      const htmlRegex = /(<([^>]+)>)/ig;
      return `${summary.replace(htmlRegex, '')}...`;
    } else {
      return `empty note`;
    }
  }

  createNote() {

  }

}

export { Note };
