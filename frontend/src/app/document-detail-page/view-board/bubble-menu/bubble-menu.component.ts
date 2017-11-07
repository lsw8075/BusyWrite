import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BubbleType, Bubble, LeafBubble, InternalBubble } from '../../document-detail-page.component';

export enum MenuType {
  borderTopMenu = 1,
  borderBottomMenu,
  leafMenu,
  internalMenu,
}

@Component({
  selector: 'app-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.css']
})
export class BubbleMenuComponent implements OnInit {
  menuType = MenuType;
  menu: MenuType;
  bubble: Bubble;
  offsetY: string;

  constructor() { }

  ngOnInit() {}

  public showMenu(item) {
    this.menu = item.menuType;
    this.bubble = item.bubble;

  }

  public openSangjunBoardEvent() {

  }

  public splitBubbleEvent() {

  }

  public popBubbleEvent() {

  }

  public wrapBubbleEvent() {

  }

  public createBubbleEvent() {

  }

  public editBubbleEvent() {


  }

  public deleteBubbleEvent() {

  }



} /* istanbul ignore next */
