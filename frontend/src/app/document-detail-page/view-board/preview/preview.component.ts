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
      this.bubbleTraversal(rootBubble);
    });
  }

  bubbleTraversal(bubble: Bubble) {
    if (bubble.type === BubbleType.leafBubble) {
      let leafBubble = bubble as LeafBubble;
      this.contentList.push(leafBubble.content);
    } else {
      let internalBubble = bubble as InternalBubble;
      for (let childBubble of internalBubble.childBubbleList) {
        this.bubbleTraversal(childBubble);
      }
    }
  }

}
