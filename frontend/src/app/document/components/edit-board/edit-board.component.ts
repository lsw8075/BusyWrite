import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Note, NoteService, Bubble, BoardService } from './service';
import { EventBubbleService } from './service';

import { Board } from '../../models/board';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../reducers/reducer';
import * as fromBubble from '../../reducers/bubble-reducer';
import * as BubbleAction from '../../actions/bubble-action';
import * as SangjunBoardAction from '../../actions/sangjun-bubble-action';
import * as EditBoardAction from '../../actions/edit-board-action';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css', '../board-style.css']
})
export class EditBoardComponent implements OnInit, OnDestroy {

  notes$: Observable<Array<Note>>;
  editBubbles$: Observable<Array<Bubble>>;

  constructor(
        private _store: Store<fromDocument.State>,
        private _noteService: NoteService,
        private _boardService: BoardService,
        private _eventBubbleService: EventBubbleService) {
        this.editBubbles$ = this._store.select(fromDocument.getEditBubbles);
        this._store.select(fromDocument.getEditBubbles).subscribe((editBubbles) => {
            console.log(editBubbles);
        });

  }

  ngOnInit() {
  }

  public finishEdit(bubble: Bubble) {
//    this._boardService.finishEdit(editItem.bubble, editItem.content);
    // this.editItems = this.editItems.filter(e => e.id !== editItem.id);
  }

  public createNewEditItem(bubble: Bubble) {
    // this.editItems.push(editItem);
    // console.log('new item');
  }

  public focusEditItem(bubble: Bubble, focused: boolean) {
    // this._eventBubbleService.edittedBubble = (focused) ? editItem.bubble : null;
  }

  public updateEditItem(bubble: Bubble, updateString: string) {
      console.log('update bubble event', updateString);
      this._store.dispatch(new BubbleAction.EditUpdate({bubbleId: bubble.id, content: updateString}));
//    this._boardService.updateEdit(editItem.bubble, editItem.content);
  }

  addNote() {
    // this._noteService.addNote()
    //   .then(note => {
    //     this.notes.push(note);
    //   });
  }

  deleteNote(note: Note) {
    // this._noteService.deleteNote(note)
    //   .then(response => {
    //     this.notes = this.notes.filter(n => n.id !== note.id);
    //   });
  }

  updateNote(note: Note) {
    // this._noteService.updateNote(note).then(response => {
    //   console.log('note changed!');
    // });
  }

  ngOnDestroy() {

  }

  public toComment(note: Note) {
    console.log('tocomment');
  }

  public toBubble(note: Note) {

  }


}

export { Note };
