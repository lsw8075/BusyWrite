import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, HostListener } from '@angular/core';
import { BubbleService } from '../service';
import { ActionType, MenuType, getBubbleById } from '../service';
import { Bubble, InternalBubble, LeafBubble, BubbleType } from '../../../models/bubble';
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
export class BubbleListViewComponent implements OnInit {
  menuType = MenuType;
  actionType = ActionType;

  @Input() rootBubble: Bubble; // bubbles that have root as parents
  @Input() bubbleList: Array<Bubble>;

  userId = 1; // to be @inputed from parent
  selectedMenu: MenuType = MenuType.noMenu;

    constructor(
        private _store: Store<fromDocument.State>,
        private _bubbleService: BubbleService,
        private _eventBubbleService: EventBubbleService,
        private _boardService: BoardService) {
            this._store.select(fromDocument.getSelectedMenu).subscribe(menu => {
                this.selectedMenu = menu;
            });
    }

    ngOnInit() {
    }

    public isInternal(bubble: Bubble): boolean {
        return (bubble.type === BubbleType.internalBubble);
    }

    public getBubbleById(id: number): Bubble {
        return getBubbleById(this.bubbleList, id);
    }

    public onClickEvent(bubble: Bubble, menu: MenuType, mouseEvent: MouseEvent): void {
        this._store.dispatch(new BubbleAction.Select({bubble, menu}));
    }

    public isMenuOpen(bubble: Bubble, menu: MenuType): boolean {
        return (bubble.isSelected) && this.selectedMenu === menu;
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


    // clickDelete(bubble: Bubble) {
    //     this._store.dispatch(new BubbleAction.Delete(bubble.id));
    // }

    // clickPop(bubble: Bubble) {
    //     this._store.dispatch(new BubbleAction.Pop(bubble.id));
    // }

    // clickCreateAbove(bubble: Bubble) {
    //     this._store.dispatch(new BubbleAction.Create({bubbleId: bubble.id, isAbove: true}));
    // }

    // clickCreateBelow(bubble: Bubble) {
    //     this._store.dispatch(new BubbleAction.Create({bubbleId: bubble.id, isAbove: false}));
    // }

    // clickEdit(bubble: Bubble) {
    //     this._store.dispatch(new BubbleAction.Edit(bubble.id));
    // }

    // clickFlatten(bubble: Bubble) {
    //     this._store.dispatch(new BubbleAction.Flatten(bubble.id));
    // }

    public clearState(event): void {
        this._store.dispatch(new BubbleAction.SelectClear());
    }

//   public createBubble(bubble: BubbleTemp, menu: MenuType) {
//     let location = bubble.location;
//     if (menu === MenuType.borderBottomMenu) {
//       location++;
//     } else if (menu !== MenuType.borderTopMenu) {
//       throw new Error('create bubble invoked with not border');
//     }
//   }
//   private finishEdit(bubble: BubbleTemp) {
//     bubble.releaseLock();
//     this._eventBubbleService.edittedBubble = null;
//     this._refreshBubbleList();
//   }
//   public editBubble(bubble: BubbleTemp) {
//     if (bubble.type === BubbleType.leafBubble &&
//         this.isBubbleContentShown(bubble)) {
//     //  this._boardService.editBubble(bubble);
//       this._eventBubbleService.clearState();
//       this._refreshBubbleList();
//     }
//   }
//   public deleteBubble(bubble: BubbleTemp) {
//     if (bubble.id !== 0) {
//       this._eventBubbleService.setState(ActionType.delete);
//       // this._bubbleService.deleteBubble(bubble).then(() => {
//       //     this._eventBubbleService.clearState();
//       //     this._refreshBubbleList();
//       //   });
//     } else {
//       throw new Error('Cannot delete root bubble');
//     }
//   }
  public isBubbleContentShown(bubble: LeafBubble): boolean {
    return (bubble.ownerId === -1) ||
           (bubble.ownerId === 1);
  }
//   ngOnDestroy() {
//     alert('there might be unsaved changes');
//     this._eventBubbleService.unsubscribeAll();
//   }

} /* istanbul ignore next */
