import { MenuType } from '../bubble-menu/bubble-menu.component';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { BubbleType, Bubble, LeafBubble, InternalBubble } from '../view-board.component';

@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css']
})
export class BubbleListViewComponent implements OnInit {

  @Output() openMenu = new EventEmitter();
  @ViewChild('bubbleUnit') bubbleUnit: ElementRef;
  bubbleRootList: Array<Bubble>; // bubbles that have root as parents
  menuType = MenuType;

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    this._bubbleService.getBubbleById(0).then(rootBubble => {
      this.bubbleRootList = (rootBubble as InternalBubble).childBubbleList;
      console.assert(this.bubbleRootList.length >= 0, 'bubble list cannot be negative');
    });
  }

  public showMenuEvent(bubble, menuType) {
    const element = this.bubbleUnit.nativeElement;
    const event = {menuType, bubble, element};
    this.openMenu.emit(event);
  }

  public isInternal(bubble: Bubble): Boolean {
    return bubble.type === BubbleType.internalBubble;
  }

  public setStyle(bubble: Bubble): object {
    const height = this._bubbleService.calcBubbleHeight(bubble);
    const lineWidth = 2;
    const space = 10;
    const offset = 5;
    const styles = {};
    styles['border-left-width'] = `${lineWidth}px`;
    styles['border-right-width'] = `${lineWidth}px`;
    styles['margin'] = `0px -${offset + height * space}px`;
    styles['padding'] = `0px ${offset + height * space - lineWidth}px`;
    return styles;
  }

  // public splitBubble() {

  // }

  // public onSplitBubbleEvent() {

  // }

  // public onPopBubbleEvent() {

  // }

  // public onWrapBubbleEvent() {

  // }

  // public onCreateBubbleEvent() {

  // }

  // public onEditBubbleEvent() {

  // }

  // public onDeleteBubbleEvent() {

  // }
} /* istanbul ignore next */
