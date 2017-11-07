import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BubbleType, Bubble, LeafBubble, InternalBubble } from '../../document-detail-page.component';
import { BubbleService } from '../../document-detail-page.component';

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

  @Output() action = new EventEmitter();

  menuType = MenuType;
  menu: MenuType;
  bubble: Bubble;
  offsetY: number;

  constructor(
    private _bubbleSerivce: BubbleService
  ) { }

  ngOnInit() {}

  public showMenu(item) {
    this.menu = item.menuType;
    this.bubble = item.bubble;
    this.offsetY = item.offsetY;
  }

  public getStyle() {  // for offset
    const styles = {};
    styles['position'] = 'relative';
    styles['top'] = `${this.offsetY}px`;
    styles['left'] = `-50px`;
    return styles;
  }

  public openSangjunBoardEvent() {
    console.log('open sanjun');
  }

  public splitBubbleEvent() {
    console.log('split bubble');
  }

  public popBubbleEvent() {
    console.log('pop bubble');
  }

  public wrapBubbleEvent() {
    console.log('wrap bubble');
  }

  public createBubbleEvent() {
    console.log('create bubble');
  }

  public editBubbleEvent() {
    console.log('edit bubble');

  }

  public deleteBubbleEvent() {
    const act = 'delete';
    const bubble = this.bubble;
    const event = {
      act, bubble
    };
    this.action.emit(event);
  }



} /* istanbul ignore next */
