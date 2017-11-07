import { Component, EventEmitter, OnInit, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../view-board.component';
import { MenuType } from '../bubble-menu/bubble-menu.component';

@Component({
  selector: 'app-bubble-detail-view',
  templateUrl: './bubble-detail-view.component.html',
  styleUrls: ['./bubble-detail-view.component.css']
})
export class BubbleDetailViewComponent implements OnInit {

  @Input() bubble: Bubble;
  @Output() openMenu = new EventEmitter();
  @ViewChild('bubbleUnit') bubbleUnit: ElementRef;
  children: Array<Bubble>;

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    if (this.isInternal()) {
      this._getChildren();
    }
  }

  public showBorderMenuEvent(bubble, isTop: boolean) {
    const element = this.bubbleUnit.nativeElement;
    const menuType = MenuType.borderMenu;
    const event = {menuType, bubble, isTop, element};
    this.openMenu.emit(event);
  }

  public showBubbleMenuEvent(bubble) {
    const element = this.bubbleUnit.nativeElement;
    const menuType = MenuType.bubbleMenu;
    const event = {menuType, bubble, element};
    this.openMenu.emit(event);
  }

  public propagateMenuEvent(item: any) {
    this.openMenu.emit(item);
  }

  public getContent(): string {
    if (this.bubble.type === BubbleType.leafBubble) {
      return (this.bubble as LeafBubble).content;
    } else {
      throw new Error('this is not leaf bubble, do not have content');
    }
  }

  public isInternal(): Boolean {
    return this.bubble.type === BubbleType.internalBubble;
  }

  public setStyle(): object {
    const height = this._getHeight();
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

  private _getChildren(): void {
    this.children =  (this.bubble as InternalBubble).childBubbleList;
  }

  private _getHeight(): number {
    return this._bubbleService.calcBubbleHeight(this.bubble);
  }
}  /* istanbul ignore next */
