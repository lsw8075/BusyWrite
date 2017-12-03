import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BubbleTemp } from '../service';
import { EditItem } from '../service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {


  @Input() editItem: EditItem;
  @Output() focus: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() update: EventEmitter<void> = new EventEmitter<void>();


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
    this.editorContent = this.editItem.bubble.getContent();
  }

  onEditorBlured(quill) {
    this.focus.emit(false);
  }

  onEditorFocused(quill) {
    this.focus.emit(true);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    // console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    console.log('quill content is changed!', quill, html, text);
    this.editItem.content = html;
    this.update.emit(null);
  }

} /* istanbul ignore next */
