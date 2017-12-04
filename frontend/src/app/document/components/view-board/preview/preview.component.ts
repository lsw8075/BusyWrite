import { Component, OnInit, Input } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, BubbleTemp } from '../service';

import { BoardService } from '../../../services/board.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {

  rootBubble: BubbleTemp;

  constructor(
    private _boardService: BoardService,
    private _bubbleService: BubbleService) {
  }

  ngOnInit() {
  }

} /* istanbul ignore next */
