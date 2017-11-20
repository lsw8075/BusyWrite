import { Component, EventEmitter, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, Bubble, ActionType, MenuType } from '../service';
import { InternalBubble, LeafBubble } from '../../../model/bubble';
import { EventBubbleService, BoardService } from '../service';

@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css'],
})
export class BubbleListViewComponent implements OnInit {
  menuType = MenuType;
  actionType = ActionType;

  rootBubble: Bubble; // bubbles that have root as parents

  hightlightedText = '';
  highlightOffset = 0;

  constructor(
    private _bubbleService: BubbleService,
    private eRef: ElementRef,
    private _eventBubbleService: EventBubbleService,
    private _boardService: BoardService) {}

  ngOnInit() {
    this._refreshBubbleList();
    this._subscribeEvents();
  }

  // host listener to check if user click outside
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this._eventBubbleService.clearState();
    }
  }
  // @HostListener('document:keyup', ['$event'])
  // onKeyUp(ev: KeyboardEvent) {
  //   console.log(`The user just pressed ${ev.key}!`);
  // }


  public openSangjunBoard(bubble: Bubble) {
    this._eventBubbleService.setState(ActionType.openSangjun);
    console.log(`[${bubble.id}] openSangjunBoard`);
    this._eventBubbleService.clearState();
  }

  showSelectedText(bubble: Bubble) {
    let text = '';
    let startOffset = 0;
    if (window.getSelection) {
        text = window.getSelection().toString();
        startOffset = window.getSelection().getRangeAt(0).startOffset;
        console.log(window.getSelection().getRangeAt(0));
    } else if ((document as any).selection && (document as any).selection.type !== 'Control') {
        text = (document as any).selection.createRange().text;
        startOffset = (document as any).selection.createRange().startOffset;
    }
    console.log(text, startOffset);
    this.hightlightedText = text;
    this.highlightOffset = startOffset;
  }

  public splitBubble(bubble: Bubble) {
    console.log('split bubble');
    this._eventBubbleService.setState(ActionType.split);
    this._bubbleService.splitLeafBubble(bubble, this.hightlightedText, this.highlightOffset)
      .then(() => {
        this._refreshBubbleList();
        this._eventBubbleService.clearState();
      });
  }

  public popBubble(bubble: Bubble) {
    this._eventBubbleService.setState(ActionType.pop);
    this._bubbleService.popBubble(bubble)
      .then(() => {
        this._refreshBubbleList();
        this._eventBubbleService.clearState();
      });
  }

  public wrapBubble() {
    this._eventBubbleService.setState(ActionType.wrap);
  }

  public wrapSelectedBubbles() {
    const wrapBubbles: Array<Bubble> = this._eventBubbleService.wrapBubbles;
    this._bubbleService.wrapBubble(wrapBubbles)
      .then(response => {
        this._refreshBubbleList();
        this._eventBubbleService.clearState();
        console.log('hi');
      });
  }

  public isWrapSelected(): boolean {
    return this._eventBubbleService.getActionState() === ActionType.wrap;
  }
public createBubble(bubble: Bubble, menu: MenuType) {
    this._eventBubbleService.setState(ActionType.create);
    let location = bubble.location;
    if (menu === MenuType.borderBottomMenu) {
      location++;
    } else if (menu !== MenuType.borderTopMenu) {
      throw new Error('create bubble invoked with not border');
    }
    this._bubbleService.createBubble(bubble.parentBubble, location, 'empty bubble')
      .then(response => {
        this._boardService.createBubble(response);
        this._eventBubbleService.clearState();
        this._refreshBubbleList();
      });
  }

  private finishEdit(bubble: Bubble) {
    this._eventBubbleService.edittedBubble = null;
    this._refreshBubbleList();
  }

  public editBubble(bubble: Bubble) {
    if (bubble.type === BubbleType.leafBubble) {
      const newString = prompt('edit bubble!', (bubble).getContent());
      if (newString) {
        this._eventBubbleService.setState(ActionType.edit);
        this._bubbleService.editBubble(bubble as LeafBubble, newString)
          .then(() => {
            this._eventBubbleService.clearState();
            this._refreshBubbleList();
          });
      }
    }
  }
public deleteBubble(bubble: Bubble) {
    console.log('delete bubble');
    if (bubble.id !== 0) {
      this._eventBubbleService.setState(ActionType.delete);
      this._bubbleService.deleteBubble(bubble)
        .then(() => {
          this._eventBubbleService.clearState();
          this._refreshBubbleList();
        });
    } else {
      throw new Error('Cannot delete root bubble');
    }
  }

  public flattenBubble(bubble: Bubble) {
    this._eventBubbleService.setState(ActionType.flatten);
    console.log('flatten bubble');
    this._bubbleService.flattenBubble(bubble)
      .then(() => {
        this._eventBubbleService.clearState();
        this._refreshBubbleList();
      });
  }


public onClickEvent(bubble: Bubble, menu: MenuType, mouseEvent: MouseEvent): void {
  console.log('clicked');
    this._eventBubbleService.selectBubble(bubble, menu);
}

  public isMenuOpen(bubble, menuType): boolean {
    return this._eventBubbleService.isMenuOpen(bubble, menuType);
  }

  public isBubbleContentShown(bubble): boolean {
    return (bubble.whoIsEditting() === -1) ||
           (bubble.whoIsEditting() === 1);
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

    if (this._eventBubbleService.isBubbleSelected(bubble)) {
      styles['background-color'] = `rgb(157, 172, 255)`;
    }

    return styles;
  }

  public setLeafBubbleStyle(bubble: Bubble): object {
    const styles = {};
    const lineWidth = 1;
    styles['border-left-width'] = `${lineWidth}px`;
    styles['border-right-width'] = `${lineWidth}px`;

    if (this._eventBubbleService.isBubbleSelected(bubble)) {
      styles['background-color'] = `rgb(157, 172, 255)`;
    }

    if (this._eventBubbleService.isBeingEditted(bubble)) {
      styles['background-color'] = `red`;
    }

    return styles;
  }


  private _refreshBubbleList() {
    this._bubbleService.getRootBubble().then(rootBubble => {
      this.rootBubble = rootBubble;
    });
  }

  private _subscribeEvents() {
    this._eventBubbleService.sangjunBoardOpenEvent$.subscribe((bubble) => {
      this.openSangjunBoard(bubble);
    });
    this._eventBubbleService.splitBubbleEvent$.subscribe((bubble) => {
      this.splitBubble(bubble);
    });
    this._eventBubbleService.popBubbleEvent$.subscribe((bubble) => {
      this.popBubble(bubble);
    });
    this._eventBubbleService.wrapBubbleEvent$.subscribe((bubble) => {
      this.wrapBubble();
    });
    this._eventBubbleService.createBubbleEvent$.subscribe((response) => {
      this.createBubble(response.bubble, response.menu);
    });
    this._eventBubbleService.editBubbleEvent$.subscribe((bubble) => {
      this.editBubble(bubble);
    });
    this._eventBubbleService.deleteBubbleEvent$.subscribe((bubble) => {
      this.deleteBubble(bubble);
    });
    this._eventBubbleService.flattenBubbleEvent$.subscribe((bubble) => {
      this.flattenBubble(bubble);
    });

    this._boardService.finishBubbleEditEvent$.subscribe((bubble) => {
      this.finishEdit(bubble);
    });
  }

} /* istanbul ignore next */
