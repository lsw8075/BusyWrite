import { Component, OnInit, Output } from '@angular/core';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { MenuType, ActionType, Board, Bubble } from './service';
import { BubbleService } from './service';

import { PreviewComponent } from './preview/preview.component';
import { BoardService } from '../../service/board.service';
import { EventBubbleService } from '../../service/event/event-bubble.service';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css'],
})

export class ViewBoardComponent implements OnInit {

  constructor(
      private _boardService: BoardService,
      private _bubbleService: BubbleService,
      private _eventBubbleService: EventBubbleService) {
  }

  ngOnInit() {}

  previewClick(event) {
      if (event.index === 1) {
        this._boardService.updatePreview();
      }
  }

  // public onShowBubbleMenuEvent() {

  // }

  // public onShowBorderMenuEvent() {

  // }

  // public onOpenSangjunBoardEvent() {

  // }

} /* istanbul ignore next */

