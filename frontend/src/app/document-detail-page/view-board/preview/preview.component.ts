import { Component, OnInit, Input } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, Bubble } from '../service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  rootBubble: Bubble;

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this._bubbleService.getRootBubble().then(rootBubble => {
      this.rootBubble = rootBubble;
    });
  }

} /* istanbul ignore next */
