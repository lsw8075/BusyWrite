import { Component, OnInit, Output } from '@angular/core';
import { BubbleService, BoardService } from '../document-detail-page.component';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css']
})
export class ViewBoardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public openPreview() { // when click on previewTab

  }

  public openBubbleView() { // when click on bubbleViewTab

  }

  public onShowBubbleMenuEvent() {

  }

  public onShowBorderMenuEvent() {

  }

  public onOpenSangjunBoardEvent() {

  }

}


export { BubbleService, BoardService };
