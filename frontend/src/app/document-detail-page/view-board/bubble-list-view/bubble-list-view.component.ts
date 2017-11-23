import { Component, EventEmitter, OnInit, OnDestroy, Output, HostListener } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, Bubble, ActionType, MenuType } from '../service';
import { InternalBubble, LeafBubble } from '../../../model/bubble';
import { EventBubbleService, BoardService } from '../service';

@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css'],

})
export class BubbleListViewComponent implements OnInit, OnDestroy {
  menuType = MenuType;
  actionType = ActionType;

  rootBubble: Bubble; // bubbles that have root as parents

  hightlightedText = '';
  highlightOffset = 0;

  constructor(
    private _bubbleService: BubbleService,
    private _eventBubbleService: EventBubbleService,
    private _boardService: BoardService) {}

  ngOnInit() {
    this._refreshBubbleList();
    this._subscribeEvents();
  }

  // when user closes
  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event) {
  //   alert('before unload');
  // }

  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHander(event) {
  //   alert('unload');
  // }

  // host listener to check if user click outside

  // @HostListener('document:keyup', ['$event'])
  // onKeyUp(ev: KeyboardEvent) {
  //   console.log(`The user just pressed ${ev.key}!`);
  // }

  public clearState(event): void {
    this._eventBubbleService.clearState();
  }

  // public openSangjunBoard(bubble: Bubble) {
  //   this._eventBubbleService.setState(ActionType.openSangjun);
  //   console.log(`[${bubble.id}] openSangjunBoard`);
  //   this._eventBubbleService.clearState();
  // }

  private showSelectedText(bubble: Bubble) {
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
    this._bubbleService.splitLeafBubble(bubble, this.hightlightedText, this.highlightOffset)
      .then(() => {
        this._refreshBubbleList();
        this._eventBubbleService.clearState();
      });
  }

  public popBubble(bubble: Bubble) {
    this._bubbleService.popBubble(bubble)
      .then(() => {
        this._refreshBubbleList();
        this._eventBubbleService.clearState();
      });
  }

  public wrapBubble() {
    this._bubbleService.wrapBubble(this._eventBubbleService.wrapBubbles)
      .then(response => {
        this._refreshBubbleList();
        this._eventBubbleService.clearState();
      });
  }

  public isWrapSelected(): boolean {
    return this._eventBubbleService.getActionState() === ActionType.wrap;
  }

  public createBubble(bubble: Bubble, menu: MenuType) {
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
    this._bubbleService.flattenBubble(bubble)
      .then(() => {
        this._eventBubbleService.clearState();
        this._refreshBubbleList();
      });
  }


  public onClickEvent(bubble: Bubble, menu: MenuType, mouseEvent: MouseEvent): void {
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

  private _refreshBubbleList() {
    this._bubbleService.getRootBubble().then(rootBubble => {
      this.rootBubble = rootBubble;
      console.log('bubble list refreshed');
    });
  }

  private _subscribeEvents() {
    this._eventBubbleService.splitBubbleEvent$.subscribe((bubble) => {
      this.splitBubble(bubble);
    });
    this._eventBubbleService.popBubbleEvent$.subscribe((bubble) => {
      this.popBubble(bubble);
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

    // must unsubscribe on Destroy
  }

  ngOnDestroy() {
    alert('there might be unsaved changes');
    this._eventBubbleService.unsubscribeAll();
  }

} /* istanbul ignore next */
