import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../edit-board.component';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css']
})
export class NoteViewComponent implements OnInit {

  @Input() note: Note;
  editor;
  editorContent = '';
  editorContentText = '';
  editorOptions = {
    placeholder: `Write Notes Freely! You can even drag around notes`,
    scrollingContainer: '.note',
    theme: 'snow',
    // modules: {
    //   toolbar: [
    //     [{ header: [1, 2, false] }],
    //     ['bold', 'italic', 'underline'],
    //     ['image', 'code-block']
    //   ]
    // },
  };

  constructor() {}

  ngOnInit() {
  }

  getSummary(): string {
    if (this.editorContentText === '') {
      return `empty note`;
    } else {
      return `${this.editorContentText.slice(0, 30)}...`;
    }
  }

  onEditorBlured(quill) {
    console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    console.log('quill content is changed!', quill, html, text);
    this.note.content = this.editorContent;
    this.editorContentText = text;
  }
}

