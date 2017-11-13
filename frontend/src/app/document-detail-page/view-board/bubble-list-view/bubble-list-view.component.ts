import { Component, EventEmitter, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { BubbleType, Bubble, LeafBubble, InternalBubble, ActionType } from '../view-board.component';
import { MenuType } from '../bubble-menu/bubble-menu.component';


@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css'],
})
export class BubbleListViewComponent implements OnInit {

  bubbleRootList: Array<Bubble>; // bubbles that have root as parents
  menuType = MenuType;
  actionType = ActionType;

  selectedBubble: Bubble;
  selectedMenuType: MenuType;

  wrapBubbles: Array<Bubble> = [];
  isWrapSelected = false;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.selectedBubble = null;
      this.isWrapSelected = false;
      this.wrapBubbles = [];
      console.log('clicked outside');
    }
  }

  constructor(
    private _bubbleService: BubbleService,
    private eRef: ElementRef
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
        this.splitBubbleEvent(event.bubble);
        break;
      case ActionType.pop:
        this.popBubbleEvent(event.bubble);
        break;
      case ActionType.wrap:
        this.wrapBubbleEvent();
        break;
      case ActionType.create:
        this.createBubbleEvent(event.bubble, event.menu);
        break;
      case ActionType.edit:
        this.editBubbleEvent(event.bubble);
        break;
      case ActionType.delete:
        this.deleteBubbleEvent(event.bubble);
        break;
      default:
        throw new Error('undefined action type');
    }
    this.selectedBubble = null;
  }

  public openSangjunBoardEvent() {
    console.log('open sanjun board!');
  }

  public splitBubbleEvent(bubble: Bubble) {
    console.log('split bubble');
  }

  public popBubbleEvent(bubble: Bubble) {
    console.log('pop bubble');
    this._bubbleService.popBubble(bubble.id)
      .then(() => this.refreshBubbleList());
  }

  public wrapBubbleEvent() {
    console.log('wrap bubble');
    this.isWrapSelected = true;
    this.wrapBubbles.push(this.selectedBubble);
  }

  public wrapSelectedBubbles() {
    this._bubbleService.wrapBubble(this.wrapBubbles.map(selectBubble => selectBubble.id))
      .then(response => {
        this.refreshBubbleList();
        this.cancelWrap();
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

  public editBubbleEvent(bubble: Bubble) {
    console.log('edit bubble');
    if (bubble instanceof LeafBubble) {
      const newString = prompt('edit bubble!', (bubble as LeafBubble).content);
      if (newString) {
        this._bubbleService.editBubble(bubble.id, newString)
          .then(() => this.refreshBubbleList());
      }
    }
  }

  public deleteBubbleEvent(bubble: Bubble) {
    console.log('delete bubble');
    if (bubble.id !== 0) {
      this._bubbleService.deleteBubble(bubble.id)
        .then(() => this.refreshBubbleList());

    } else {
      throw new Error('Cannot delete root bubble');
    }
  }

  private cancelWrap() {
    this.wrapBubbles = [];
    this.isWrapSelected = false;
  }


  public showMenuEvent(bubble: Bubble, menuType: MenuType, mouseEvent: MouseEvent) {
    if (this.isWrapSelected &&
        menuType === MenuType.leafMenu &&
        this.wrapBubbles[0].parentID === bubble.parentID
       ) {
        if (this._isBubbleSelected(bubble)) {
          this.wrapBubbles = this.wrapBubbles.filter(b => b.id !== bubble.id);
        } else {
          this.wrapBubbles.push(bubble);
        }
        console.log(this.wrapBubbles.length);
    } else {
      this.cancelWrap();
      this.selectedBubble = bubble;
      this.selectedMenuType = menuType;
    }
  }
  public isMenuOpen(bubble, menuType) {
    if (this.selectedBubble) {
      return (!this.isWrapSelected) &&
      (bubble.id === this.selectedBubble.id) &&
      (menuType === this.selectedMenuType);
    } else {
      return false;
    }
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

  public setInternalBubbleStyle(bubble: Bubble): object {
    const height = this._bubbleService.calcBubbleHeight(bubble);
    const lineWidth = 2;
    const space = 8;
    const offset = -5;
    const styles = {};
    styles['border-left-width'] = `${lineWidth}px`;
    styles['border-right-width'] = `${lineWidth}px`;
    styles['margin'] = `0px -${offset + height * space}px`;
    styles['padding'] = `0px ${offset + height * space - lineWidth}px`;

    if (this._isBubbleSelected(bubble)) {
      styles['background-color'] = `rgb(157, 172, 255)`;
    }

    return styles;
  }

  public setLeafBubbleStyle(bubble: Bubble): object {
    const styles = {};
    const lineWidth = 1;
    styles['border-left-width'] = `${lineWidth}px`;
    styles['border-right-width'] = `${lineWidth}px`;

    if (this._isBubbleSelected(bubble)) {
      styles['background-color'] = `rgb(157, 172, 255)`;
    }

    return styles;
  }

  private _isBubbleSelected(bubble: Bubble): boolean {
    if (this.selectedBubble) {
      if (this.selectedBubble.id === bubble.id) {
        return true;
      }
    } else if (this.isWrapSelected) {
      for (let b of this.wrapBubbles) {
        console.log(b);
        if (b.id === bubble.id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

} /* istanbul ignore next */
