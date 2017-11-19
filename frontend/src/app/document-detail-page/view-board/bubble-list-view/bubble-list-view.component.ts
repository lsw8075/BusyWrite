import { Component, EventEmitter, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, Bubble, ActionType, MenuType } from '../service';
import { InternalBubble, LeafBubble } from '../../../model/bubble';
import { EventBubbleService } from '../service';

enum SelectMode {
  none = 1,
  openSangjunBoard, split, pop, wrap, create, edit, delete, flatten,
  insertNote
}

@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css'],
})
export class BubbleListViewComponent implements OnInit {
  menuType = MenuType;
  actionType = ActionType;

  rootBubble: Bubble; // bubbles that have root as parents
  state: SelectMode = SelectMode.none;
  selectedBubble: Bubble;
  selectedMenuType: MenuType;

  wrapBubbles: Array<Bubble> = [];
  isWrapSelected = false;

  hightlightedText = '';
  highlightOffset = 0;

  constructor(
    private _bubbleService: BubbleService,
    private eRef: ElementRef,
    private _eventBubbleService: EventBubbleService) {

    _eventBubbleService.sangjunBoardOpenEvent$.subscribe((bubble) => {
      this.openSangjunBoard(bubble);
    });
    _eventBubbleService.splitBubbleEvent$.subscribe((bubble) => {
      this.splitBubble(bubble);
    });
    _eventBubbleService.popBubbleEvent$.subscribe((bubble) => {
      this.popBubble(bubble);
    });
    _eventBubbleService.wrapBubbleEvent$.subscribe((bubble) => {
      this.wrapBubble();
    });
    _eventBubbleService.createBubbleEvent$.subscribe((response) => {
      this.createBubble(response.bubble, response.menu);
    });
    _eventBubbleService.editBubbleEvent$.subscribe((bubble) => {
      this.editBubble(bubble);
    });
    _eventBubbleService.deleteBubbleEvent$.subscribe((bubble) => {
      this.deleteBubble(bubble);
    });
    _eventBubbleService.flattenBubbleEvent$.subscribe((bubble) => {
      this.flattenBubble(bubble);
    });
  }

  ngOnInit() {
    this._refreshBubbleList();
  }

  // host listener to check if user click outside
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.selectedBubble = null;
      this.isWrapSelected = false;
      this.wrapBubbles = [];
      this.state = SelectMode.none;
    }
  }
  // @HostListener('document:keyup', ['$event'])
  // onKeyUp(ev: KeyboardEvent) {
  //   console.log(`The user just pressed ${ev.key}!`);
  // }


  public openSangjunBoard(bubble: Bubble) {
    console.log(`[${bubble.id}] openSangjunBoard`);
    this.state = SelectMode.openSangjunBoard;
    this.selectedBubble = null;

    this.state = SelectMode.none;
  }

  showSelectedText(bubble: Bubble) {
    this.state = SelectMode.split;
    let text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
        console.log(window.getSelection().getRangeAt(0).startOffset);
    } else if ((document as any).selection && (document as any).selection.type !== 'Control') {
        text = (document as any).selection.createRange().text;
    }
    this.hightlightedText = text;
    this.highlightOffset = window.getSelection().getRangeAt(0).startOffset;
    console.log('text ', this.hightlightedText);
  }

  public splitBubble(bubble: Bubble) {
    console.log('split bubble');
    this._bubbleService.splitLeafBubble(bubble, this.hightlightedText, this.highlightOffset)
      .then(() => {
        this._refreshBubbleList();
        this.selectedBubble = null;
        this.state = SelectMode.none;
      });
  }

  public popBubble(bubble: Bubble) {
    this.state = SelectMode.pop;
    console.log('pop bubble');
    this._bubbleService.popBubble(bubble)
      .then(() => {
        this._refreshBubbleList();
        this.selectedBubble = null;
        this.state = SelectMode.none;
      });
  }

  public wrapBubble() {
    this.state = SelectMode.wrap;
    console.log('wrap bubble');
    this.isWrapSelected = true;
    this.wrapBubbles.push(this.selectedBubble);
    this.selectedBubble = null;
  }

  public wrapSelectedBubbles() {
    this._bubbleService.wrapBubble(this.wrapBubbles)
      .then(response => {
        this._refreshBubbleList();
        this.cancelWrap();
        this.state = SelectMode.none;
      });
  }
public createBubble(bubble: Bubble, menu: MenuType) {
    this.state = SelectMode.create;
    console.log('create bubble', bubble);
    let location = bubble.location;
    if (menu === MenuType.borderBottomMenu) {
      location++;
    } else if (menu !== MenuType.borderTopMenu) {
      throw new Error('create bubble invoked with not border');
    }
    this._bubbleService.createBubble(bubble.parentBubble, location, 'default create string')
      .then(response => {
        this._refreshBubbleList();
        this.selectedBubble = null;
        this.state = SelectMode.none;
      });
  }
  public editBubble(bubble: Bubble) {
    console.log('edit bubble');
    if (bubble.type === BubbleType.leafBubble) {
      const newString = prompt('edit bubble!', (bubble).getContent());
      if (newString) {
        this.state = SelectMode.edit;
        this._bubbleService.editBubble(bubble as LeafBubble, newString)
          .then(() => {
            this._refreshBubbleList();
            this.selectedBubble = null;
            this.state = SelectMode.none;
          });
      }
    }
  }
public deleteBubble(bubble: Bubble) {
    console.log('delete bubble');
    if (bubble.id !== 0) {
      this.state = SelectMode.delete;
      this._bubbleService.deleteBubble(bubble)
        .then(() => {
          this._refreshBubbleList();
          this.selectedBubble = null;
          this.state = SelectMode.none;
        });

    } else {
      throw new Error('Cannot delete root bubble');
    }
  }

  public flattenBubble(bubble: Bubble) {
    this.state = SelectMode.flatten;
    console.log('flatten bubble');
    this._bubbleService.flattenBubble(bubble)
      .then(() => {
        this._refreshBubbleList();
        this.selectedBubble = null;
        this.state = SelectMode.none;
      });
  }


public showMenuEvent(bubble: Bubble, menuType: MenuType, mouseEvent: MouseEvent) {
    if (this.isWrapSelected &&
        menuType === MenuType.leafMenu &&
        this.wrapBubbles[0].parentBubble.id === bubble.parentBubble.id
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
    const height = bubble.getHeight();
    const styles = {};
    styles['right'] = `-${50 + height * 10}px`;
    return styles;
  }

  public setInternalBubbleStyle(bubble: Bubble): object {
    const height = bubble.getHeight();
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

  private cancelWrap() {
    this.wrapBubbles = [];
    this.isWrapSelected = false;
  }

  private _refreshBubbleList() {
    this._bubbleService.getRootBubble().then(rootBubble => {
      this.rootBubble = rootBubble;
    });
  }
  private _isBubbleSelected(bubble: Bubble): boolean {
    if (this.selectedBubble) {
      if (this.selectedBubble.id === bubble.id) {
        return true;
      }
    } else if (this.isWrapSelected) {
      for (const b of this.wrapBubbles) {
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
