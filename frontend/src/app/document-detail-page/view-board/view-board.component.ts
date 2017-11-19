import { Component, OnInit, Output } from '@angular/core';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { MenuType, ActionType, Board } from './service';
import { BubbleService } from './service';

import { PreviewComponent } from './preview/preview.component';
import { BoardService } from '../../service/board.service';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css'],
})

export class ViewBoardComponent implements OnInit {

  constructor(
    private _boardService: BoardService,
    private _bubbleService: BubbleService) {
  }

  ngOnInit() {}

  previewClick(event) {
    if (event.index === 1) {
      this._boardService.updatePreview();
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

