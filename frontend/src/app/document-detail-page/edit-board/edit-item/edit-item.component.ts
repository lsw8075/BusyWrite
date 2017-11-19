import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Bubble } from '../service';
import { EditItem } from '../service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {


  @Input() editItem: EditItem;
  @Output() focus: EventEmitter<void> = new EventEmitter<void>();
  content: string;


  editor;
  editorContent = '';
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

  onEditorBlured(quill) {
    // console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    this.focus.emit();
    // console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    // console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    // console.log('quill content is changed!', quill, html, text);
    this.editItem.content = this.editorContent;
  }

}
