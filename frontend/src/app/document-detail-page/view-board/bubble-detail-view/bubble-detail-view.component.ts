import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { BubbleService } from '../view-board.component';
// import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../../../model/bubble';
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
  @Output() hover = new EventEmitter<void>();
  children: Array<Bubble>;
  showStyle = {};

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    if (!this.isLeaf()) {
      this.getChildren();
    }
  }

  public mouseEnter() {
    console.log('enter', this.bubble.id);
    this.showStyle['background-color'] = 'rgba(150, 150, 150, 0.1)';
  }

  public mouseLeave() {
    console.log('leave', this.bubble.id);
    this.showStyle['background-color'] = 'transparent';
  }

  public showBorderMenuEvent(bubble, isTop: boolean) {
    const menuType = MenuType.borderMenu;
    const event = {menuType, bubble, isTop};
    this.openMenu.emit(event);
  }

  public showBubbleMenuEvent(bubble) {
    const menuType = MenuType.bubbleMenu;
    const event = {menuType, bubble};
    this.openMenu.emit(event);
  }

  public showMenuEvent(item) {
    this.openMenu.emit(item);
  }

  public getContent(): string {
    if (this.bubble.type === BubbleType.leafBubble) {
      return (this.bubble as LeafBubble).content;
    } else {
      throw new Error('this is not leaf bubble, do not have content');
    }
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

  private _getHeight(): number {
    return this._bubbleService.calcBubbleHeight(this.bubble);
  }

  public getChildren(): void {
    this.children =  (this.bubble as InternalBubble).childBubbleList;
    console.log(this.children);
  }

  public isLeaf(): Boolean {
    return this.bubble.type === BubbleType.leafBubble;
  }
}
