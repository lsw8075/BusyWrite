import { Component, OnInit } from '@angular/core';
import { BubbleType, Bubble, LeafBubble, InternalBubble } from '../../document-detail-page.component';

export enum MenuType {
  borderMenu,
  bubbleMenu,
}

@Component({
  selector: 'app-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.css']
})
export class BubbleMenuComponent implements OnInit {

  menuType: MenuType;
  bubble: Bubble;

  constructor() { }

  ngOnInit() {
  }

  public showMenu(item) {
    this.menuType = item.menuType;
    this.bubble = item.bubble;
    console.log(item);
  }

  isBorderMenu() {
    return this.menuType === MenuType.borderMenu;
  }

  isLeafBubbleMenu() {
    if (this.menuType === MenuType.bubbleMenu) {
      return this.bubble.type === BubbleType.leafBubble;
    }
    return false;
  }

  isInternalBubbleMenu() {
    if (this.menuType === MenuType.bubbleMenu) {
      return this.bubble.type === BubbleType.internalBubble;
    }
    return false;
  }

  // public openSangjunBoardEvent() {

  // }

  // public splitBubbleEvent() {

  // }

  // public popBubbleEvent() {

  // }

  // public wrapBubbleEvent() {

  // }

  // public createBubbleEvent() {

  // }

  // public editBubbleEvent() {


  // }

  // public deleteBubbleEvent() {

  // }



} /* istanbul ignore next */
