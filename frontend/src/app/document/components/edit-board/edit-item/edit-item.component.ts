import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Bubble} from '../service';
import { EditItem } from '../service';
import { LeafBubble } from '../../../models/bubble';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {


  @Input() editBubble: LeafBubble;
  @Output() focus: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() update: EventEmitter<string> = new EventEmitter<string>();


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
    this.editorContent = this.editBubble.content;
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
    // console.log('quill content is changed!', quill, html, text);
    this.update.emit(html);
  }

} /* istanbul ignore next */
