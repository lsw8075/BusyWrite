import { Component, OnInit, Input } from '@angular/core';
import { BubbleService } from '../view-board.component';
// import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../../../model/bubble';
import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../view-board.component';
@Component({
  selector: 'app-bubble-detail-view',
  templateUrl: './bubble-detail-view.component.html',
  styleUrls: ['./bubble-detail-view.component.css']
})
export class BubbleDetailViewComponent implements OnInit {

  @Input() id: number;
  bubble: Bubble;

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    this._bubbleService.getBubbleById(this.id).then(response => {
      this.bubble = response;
      if (this.bubble.type === BubbleType.suggestBubble) {
        throw new Error('suggest bubble should not show here!');
      }
    });

  }

  public getContent(): string {
    if (this.bubble.type === BubbleType.leafBubble) {
      return (this.bubble as LeafBubble).content;
    } else {
      throw new Error('this is not leaf bubble, do not have content');
    }
  }

  public getChildren(): Array<number> {
    if (this.bubble.type === BubbleType.internalBubble) {
      return (this.bubble as InternalBubble).childBubbles;
    } else {
      throw new Error('this is not internal bubble, do not have children');
    }
  }

  public isLeaf(): Boolean {
    return this.bubble.type === BubbleType.leafBubble;
  }

  private _handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }
}
