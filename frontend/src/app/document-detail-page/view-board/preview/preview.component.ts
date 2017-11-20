import { Component, OnInit, Input } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, Bubble } from '../service';

import { BoardService } from '../../../service/board.service';

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

    _boardService.previewUpdateEvent$.subscribe(() => {
      this.refreshList();
    });
  }

  ngOnInit() {
    this.refreshList();
  }

  public refreshList() {
      this._bubbleService.getRootBubble().then(rootBubble => {
      console.log('preview updated');
      this.rootBubble = rootBubble;
    });
  }

} /* istanbul ignore next */
