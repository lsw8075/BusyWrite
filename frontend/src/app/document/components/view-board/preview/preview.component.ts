import { Component, OnInit, Input } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, Bubble } from '../service';

import { BoardService } from '../../../services/board.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {

  rootBubble: Bubble;

  constructor(
    private _boardService: BoardService,
    private _bubbleService: BubbleService) {
  }

  ngOnInit() {
  }

} /* istanbul ignore next */
