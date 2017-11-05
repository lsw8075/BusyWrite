import { Component, OnInit } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { Bubble, LeafBubble, InternalBubble } from '../view-board.component';
@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css']
})
export class BubbleListViewComponent implements OnInit {

  bubbleRootList: Array<Bubble>; // bubbles that have root as parents

  constructor(
    private _bubbleService: BubbleService
  ) { }

  ngOnInit() {
    this._bubbleService.getBubbleById(0).then(rootBubble => {
      this.bubbleRootList = (rootBubble as InternalBubble).childBubbleList;
      console.assert(this.bubbleRootList.length >= 0, 'bubble list cannot be negative');
    });
  }
  public openSangjunBoardEvent() {

  }

  public showBubbleMenuEvent() {

  }

  public showMultipleBubbleMenuEvent() {

  }

  public showBorderMenuEvent() {

  }

  public showClickableBorder() {

  }

  public splitBubble() {

  }

  public onSplitBubbleEvent() {

  }

  public onPopBubbleEvent() {

  }

  public onWrapBubbleEvent() {

  }

  public onCreateBubbleEvent() {

  }

  public onEditBubbleEvent() {

  }

  public onDeleteBubbleEvent() {

  }

}
