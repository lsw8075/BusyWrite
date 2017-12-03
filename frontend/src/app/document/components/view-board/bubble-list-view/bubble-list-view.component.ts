import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, HostListener } from '@angular/core';
import { BubbleService } from '../service';
import { BubbleType, BubbleTemp, ActionType, MenuType } from '../service';
import { InternalBubbleTemp, LeafBubbleTemp } from '../../../models/bubble-temp';
import { EventBubbleService, BoardService } from '../service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../../reducers/reducer';
import * as BubbleAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';


@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: [
    './bubble-list-view.component.css'],
})
export class BubbleListViewComponent implements OnInit, OnDestroy {
  menuType = MenuType;
  actionType = ActionType;

  @Input() rootBubble: BubbleTemp; // bubbles that have root as parents
  selectedBubble: BubbleTemp;
  selectedMenu: MenuType;

  constructor(
    private _store: Store<fromDocument.State>,
    private _bubbleService: BubbleService,
    private _eventBubbleService: EventBubbleService,
    private _boardService: BoardService) {
      // this._store.select(fromDocument.getBubbleState).subscribe(bubble => {
      //   this.selectedBubble = bubble.selectedBubble;
      //   this.selectedMenu = bubble.selectedMenu;
      //   this.rootBubble = bubble.rootBubble;
      // });
    }

  ngOnInit() {
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

  public refreshState() {
    this._refreshBubbleList();
    this._eventBubbleService.clearState();
  }

  public popBubble(bubble: BubbleTemp) {
    // this._bubbleService.popBubble(bubble)
    //   .then(() => {
    //     this._refreshBubbleList();
    //     this._eventBubbleService.clearState();
    //   });
  }

  public wrapBubble() {
    // this._bubbleService.wrapBubble(this._eventBubbleService.wrapBubbles)
    //   .then(response => {
    //     this._refreshBubbleList();
    //     this._eventBubbleService.clearState();
    //   });
  }

  public createBubble(bubble: BubbleTemp, menu: MenuType) {
    let location = bubble.location;
    if (menu === MenuType.borderBottomMenu) {
      location++;
    } else if (menu !== MenuType.borderTopMenu) {
      throw new Error('create bubble invoked with not border');
    }
  //   this._bubbleService.createBubble(bubble.parentBubble, location, 'empty bubble')
  //     .then(response => {
  // //      this._boardService.editBubble(response);
  //       this._eventBubbleService.clearState();
  //       this._refreshBubbleList();
  //     });
  }
  private finishEdit(bubble: BubbleTemp) {
    bubble.releaseLock();
    this._eventBubbleService.edittedBubble = null;
    this._refreshBubbleList();
  }
  public editBubble(bubble: BubbleTemp) {
    if (bubble.type === BubbleType.leafBubble &&
        this.isBubbleContentShown(bubble)) {
    //  this._boardService.editBubble(bubble);
      this._eventBubbleService.clearState();
      this._refreshBubbleList();
    }
  }
  public deleteBubble(bubble: BubbleTemp) {
    if (bubble.id !== 0) {
      this._eventBubbleService.setState(ActionType.delete);
      // this._bubbleService.deleteBubble(bubble).then(() => {
      //     this._eventBubbleService.clearState();
      //     this._refreshBubbleList();
      //   });
    } else {
      throw new Error('Cannot delete root bubble');
    }
  }

  public flattenBubble(bubble: BubbleTemp) {
    // this._bubbleService.flattenBubble(bubble).then(() => {
    //     this._eventBubbleService.clearState();
    //     this._refreshBubbleList();
    //   });
  }

  public moveBubble(bubble: BubbleTemp, destBubble: BubbleTemp, menu: MenuType) {
    // this._bubbleService.moveBubble(bubble, destBubble, menu).then(() => {
    //   this._eventBubbleService.clearState();
    //   this._refreshBubbleList();
    // });
  }

  public onClickEvent(bubble: BubbleTemp, menu: MenuType, mouseEvent: MouseEvent): void {
  //  this._store.dispatch(new BubbleAction.Select({bubble, menu}));
  }

  public isMenuOpen(bubble, menu): boolean {
    if (this.selectedBubble) {
      return (bubble.id === this.selectedBubble.id) && (menu === this.selectedMenu);
    }
    return false;
  }

  public isBubbleContentShown(bubble): boolean {
    return (bubble.whoIsEditting() === -1) ||
           (bubble.whoIsEditting() === 1);
  }

  public isInternal(bubble: BubbleTemp): Boolean {
    return bubble.type === BubbleType.internalBubble;
  }

  private _refreshBubbleList() {
  }

  ngOnDestroy() {
    alert('there might be unsaved changes');
    this._eventBubbleService.unsubscribeAll();
  }

} /* istanbul ignore next */
