import { Component, OnInit, Input } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { BubbleType, Bubble, LeafBubble, InternalBubble } from '../view-board.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  rootBubble: Bubble;
  contentList: string[] = [];

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    this._bubbleService.getBubbleById(0).then(rootBubble => {
      this.rootBubble = rootBubble;
      this._bubbleTraversal(rootBubble);
    });
  }

  public _bubbleTraversal(bubble: Bubble) {
    if (bubble.type === BubbleType.leafBubble) {
      const leafBubble = bubble as LeafBubble;
      this.contentList.push(leafBubble.content);
    } else {
      const internalBubble = bubble as InternalBubble;
      for (const childBubble of internalBubble.childBubbleList) {
        this._bubbleTraversal(childBubble);
      }
    }
  }

} /* istanbul ignore next */
