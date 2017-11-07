import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { BubbleService, BoardService } from '../document-detail-page.component';
import { Board } from '../document-detail-page.component';
import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../document-detail-page.component';
import { BubbleMenuComponent, MenuType, ActionType } from './bubble-menu/bubble-menu.component';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css']
})

export class ViewBoardComponent {

  constructor(
    private _bubbleService: BubbleService
  ) {}

  public action(item) {
    if (item.act === 'delete') {
      this._bubbleService.deleteBubble(item.bubble.id);
    }
  }

  // public openPreview() { // when click on previewTab

  // }

  // public openBubbleView() { // when click on bubbleViewTab

  // }

  // public onShowBubbleMenuEvent() {

  // }

  // public onShowBorderMenuEvent() {

  // }

  // public onOpenSangjunBoardEvent() {

  // }

} /* istanbul ignore next */

export { BubbleService, BoardService };
export { BubbleType, ActionType, Bubble, LeafBubble, InternalBubble, SuggestBubble, Board };
