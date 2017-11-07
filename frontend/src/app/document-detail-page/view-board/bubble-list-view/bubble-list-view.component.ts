import { MenuType } from '../bubble-menu/bubble-menu.component';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { BubbleType, Bubble, LeafBubble, InternalBubble, ActionType } from '../view-board.component';

@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css']
})
export class BubbleListViewComponent implements OnInit {

  bubbleRootList: Array<Bubble>; // bubbles that have root as parents
  menuType = MenuType;
  actionType = ActionType;

  selectedBubbles: Array<{bubble: Bubble, menuType: MenuType}> = [];

  constructor(
    private _bubbleService: BubbleService
  ) {}

  ngOnInit() {
    this.refreshBubbleList();
  }

  public refreshBubbleList() {
    this._bubbleService.getBubbleById(0).then(rootBubble => {
      this.bubbleRootList = (rootBubble as InternalBubble).childBubbleList;
      console.assert(this.bubbleRootList.length >= 0, 'bubble list cannot be negative');
      console.log('refreshed list');
    });
  }

  public bubbleAction(event) {
    console.log(event);
    switch (event.act) {
      case ActionType.openSangjun:
        this.openSangjunBoardEvent();
        break;
      case ActionType.split:
        this.splitBubbleEvent();
        break;
      case ActionType.pop:
        this.popBubbleEvent();
        break;
      case ActionType.wrap:
        this.wrapBubbleEvent();
        break;
      case ActionType.create:
        this.createBubbleEvent(event.bubble, event.menu);
        break;
      case ActionType.edit:
        this.editBubbleEvent();
        break;
      case ActionType.delete:
        this.deleteBubbleEvent();
        break;
      default:
        throw new Error('undefined action type');
    }
    this.selectedBubbles = [];
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
    this._bubbleService.wrapBubble(this.selectedBubbles.map(selectBubble => selectBubble.bubble.id))
      .then(response => {
        this.refreshBubbleList();
      });
  }

  public createBubbleEvent(bubble: Bubble, menu: MenuType) {
    console.log('create bubble', bubble);
    let location = bubble.location;

    if (menu === MenuType.borderTopMenu) {

    } else if (menu === MenuType.borderBottomMenu) {
      location++;
    } else {
      throw new Error('create bubble invoked with not border');
    }
    this._bubbleService.createBubble(bubble.parentBubble.id, location, 'default create string')
      .then(response => {
        this.refreshBubbleList();
      });
  }

  public editBubbleEvent() {
    console.log('edit bubble');

  }

  public deleteBubbleEvent() {
    console.log('delete bubble');
  }

  public cancelWrap() {
    this.selectedBubbles = [];
  }


  public showMenuEvent(bubble: Bubble, menuType: MenuType, mouseEvent: MouseEvent) {
    if (this.selectedBubbles.length === 0) {
      this.selectedBubbles.push({bubble, menuType});
    } else if ((menuType === MenuType.leafMenu) &&
               (menuType === this.selectedBubbles[0].menuType) &&
               (bubble.parentBubble.id === this.selectedBubbles[0].bubble.parentBubble.id)) {
       this.selectedBubbles.push({bubble, menuType});
    } else {
      this.cancelWrap();
      this.selectedBubbles.push({bubble, menuType});
    }

  }
  public isSingleMenuOpen(bubble, menuType) {
    return (this.selectedBubbles.length === 1) &&
           (bubble.id === this.selectedBubbles[0].bubble.id) &&
           (menuType === this.selectedBubbles[0].menuType);
  }

  public isMultiBubbleMenuOpen() {
    return (this.selectedBubbles.length > 1);
  }

  public isInternal(bubble: Bubble): Boolean {
    return bubble.type === BubbleType.internalBubble;
  }

  public setActionStyle(bubble: Bubble): object {
    const height = this._bubbleService.calcBubbleHeight(bubble);
    const styles = {};
    styles['right'] = `-${200 + height * 10}px`;
    return styles;
  }

  public setBubbleStyle(bubble: Bubble): object {
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

} /* istanbul ignore next */
