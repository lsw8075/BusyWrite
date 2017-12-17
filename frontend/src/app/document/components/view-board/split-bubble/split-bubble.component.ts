import { Component, OnInit } from '@angular/core';
import { Bubble, BubbleService, EventBubbleService, BubbleType } from '../service';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../../reducers/reducer';
import * as fromBubble from '../../../reducers/bubble-reducer';
import * as BubbleAction from '../../../actions/bubble-action';
import { LeafBubble } from '../../../models/bubble';

@Component({
  selector: 'app-split-bubble',
  templateUrl: './split-bubble.component.html',
  styleUrls: ['./split-bubble.component.css']
})
export class SplitBubbleComponent implements OnInit {

  bubble: Bubble;

  mouseDown = false;
  beforeText = '';
  highlightedText = '';
  afterText = '';
  highlightOffset = 0;

  constructor(
    private _store: Store<fromDocument.State>,
    public bsModalRef: BsModalRef,
    private _bubbleService: BubbleService,
    private _eventBubbleService: EventBubbleService) {}

  ngOnInit() {
  }

  public split() {
    if (this.highlightedText || (this.afterText && this.beforeText)) {
        if (this.bubble.type === BubbleType.leafBubble) {
            this._store.dispatch(new BubbleAction.SplitLeaf({
                bubbleId: this.bubble.id,
                contentList: [this.beforeText, this.highlightedText, this.afterText]
            }));
        }

    }
  }

  private showSelectedText() {
    if (this.mouseDown) {
      let text = '';
      let startOffset = 0;
      if (window.getSelection) {
          text = window.getSelection().toString();
          startOffset = window.getSelection().getRangeAt(0).startOffset;
          console.log(window.getSelection().getRangeAt(0));
      } else if ((document as any).selection && (document as any).selection.type !== 'Control') {
          text = (document as any).selection.createRange().text;
          startOffset = (document as any).selection.createRange().startOffset;
      }
      console.log(text, startOffset);
      this.highlightedText = text;
      this.highlightOffset = startOffset - 9;

      const content = (this.bubble as LeafBubble ).content;
      this.beforeText = content.substring(0, this.highlightOffset);
      this.afterText = content.substring(this.highlightOffset + text.length, content.length);
      this.mouseDown = false;
    }
  }

}
