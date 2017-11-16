import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { BubbleService, BoardService } from '../document-detail-page.component';
import { Board } from '../document-detail-page.component';
import { BubbleType, Bubble, SuggestBubble } from '../document-detail-page.component';
import { BubbleMenuComponent, MenuType, ActionType } from './bubble-menu/bubble-menu.component';
import { PreviewComponent } from './preview/preview.component';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css']
})

export class ViewBoardComponent implements OnInit {

 @ViewChild('PreviewComponent')
 private preview: PreviewComponent;

  constructor(
    private _bubbleService: BubbleService
  ) { }

  ngOnInit() {
  }

  previewClick(event) {
    if (event.index === 1) {
     this.preview.refreshList();
      console.log('preview tab clicked');
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
export { BubbleType, MenuType, ActionType, Bubble, SuggestBubble, Board };
