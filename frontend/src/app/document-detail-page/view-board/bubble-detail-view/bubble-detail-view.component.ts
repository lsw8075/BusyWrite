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
  children: Array<Bubble>;

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    this._bubbleService.getBubbleById(this.id).then(response => {
      this.bubble = response;
      if (!this.isLeaf()) {
        this.getChildren();
      }
    });
  }

  public setStyle(): object {
    const height = this._getHeight();
    const lineWidth = 2;
    const space = 10;
    const offset = 5;
    const styles = {};
    styles['border-left-width'] = `${lineWidth}px`;
    styles['border-right-width'] = `${lineWidth}px`;
    styles['margin'] = `0px -${offset + height * space}px`;
    styles['padding'] = `0px ${offset + height * space - lineWidth}px`;

    return styles;
  }

  private _getHeight(): number {
    return this._bubbleService.calcBubbleHeight(this.bubble);
  }

  public getContent(): string {
    if (this.bubble.type === BubbleType.leafBubble) {
      return (this.bubble as LeafBubble).content;
    } else {
      throw new Error('this is not leaf bubble, do not have content');
    }
  }

  public getChildren(): void {
    if (this.bubble.type === BubbleType.internalBubble) {
      this.children =  (this.bubble as InternalBubble).childBubbleList;
      console.log(this.children);
    } else {
      console.error(this.bubble);
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
