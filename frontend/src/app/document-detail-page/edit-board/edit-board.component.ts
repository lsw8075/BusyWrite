import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Note } from '../document-detail-page.component';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {

  notes: Array<Note>;

  constructor(private _dragulaService: DragulaService) { }

  ngOnInit() {
    this.notes = [];
    const newNote: Note = {
      id: 1,
      content: '',
      documentId: 1,
      userId: 1,
    };
    this.notes.push(newNote);
    this._dragulaService.setOptions('note-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle';
      }
    });
  }

  createNote() {

  }

}

export { Note };
