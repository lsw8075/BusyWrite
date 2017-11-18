import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { MenuType, ActionType } from './service';
import { BubbleService } from './service';

import { PreviewComponent } from './preview/preview.component';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css']
})

export class ViewBoardComponent implements OnInit {

 @ViewChild(PreviewComponent)
 private preview: PreviewComponent;

  constructor(
    private _bubbleService: BubbleService
  ) { }

  ngOnInit() {
    console.log('view board component initialized: ', this.preview);
  }

  previewClick(event) {
    if (event.index === 1) {
      console.log(this.preview);
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

