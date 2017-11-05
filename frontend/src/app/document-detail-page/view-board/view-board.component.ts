import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { BubbleService, BoardService } from '../document-detail-page.component';
import { Board } from '../document-detail-page.component';
import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../document-detail-page.component';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';

export enum MenuType {
  borderMenu,
  bubbleMenu,
}

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css']
})

export class ViewBoardComponent implements OnInit {

  @ViewChild(BubbleMenuComponent)
  private menu: BubbleMenuComponent;

  menuType: MenuType;

  constructor() { }

  ngOnInit() {
  }

  public showMenu(item) {
    this.menu.test();
    console.log('hello menu', item);
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
export { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble, Board };
