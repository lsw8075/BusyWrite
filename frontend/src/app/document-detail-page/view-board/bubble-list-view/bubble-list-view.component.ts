import { Component, OnInit } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { Bubble, LeafBubble, InternalBubble } from '../view-board.component';
@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css']
})
export class BubbleListViewComponent implements OnInit {

  temp: LeafBubble;

  constructor() { }

  ngOnInit() {
    this.temp = new LeafBubble();
    this.temp.content = 'test leaf bubble';
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
