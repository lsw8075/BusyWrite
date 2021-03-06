import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Note } from '../edit-board.component';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css']
})
export class NoteViewComponent {

  @Input() note: Note;
  @Output() changed: EventEmitter<void> = new EventEmitter<void>();
  editor;
  editorContent = '';
  editorOptions = {
    placeholder: `Write Notes Freely! You can even drag around notes`,
    scrollingContainer: '.note',
    theme: 'snow',
  };

  onEditorBlured(quill) {
    // console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    // console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    // console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    this.note.content = this.editorContent;
    this.changed.emit();
  }
} /* istanbul ignore next */

