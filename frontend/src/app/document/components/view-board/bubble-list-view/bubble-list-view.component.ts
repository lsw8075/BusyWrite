import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, HostListener } from '@angular/core';
import { BubbleService } from '../service';
import { ActionType, MenuType } from '../service';
import { Bubble, InternalBubble, LeafBubble, BubbleType } from '../../../models/bubble';
import { EventBubbleService, BoardService } from '../service';

import { Board } from '../../../models/board';

import { getBubbleById } from '../../../reducers/bubble-operation';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../../reducers/reducer';
import * as BubbleAction from '../../../actions/bubble-action';
import * as BoardAction from '../../../actions/board-action';
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

    @Input() board: Board;
    @Input() rootBubble: Bubble; // bubbles that have root as parents
    @Input() bubbleList: Array<Bubble>;
    @Input() userId: number;
    @Input() selectedBubbleList: Array<Bubble>;
    @Input() hoverBubbleList: Array<Bubble>;
    @Input() selectedMenu: MenuType;

    constructor(
        private _store: Store<fromDocument.State>,
        private _bubbleService: BubbleService,
        private _eventBubbleService: EventBubbleService,
        private _boardService: BoardService) {}

    ngOnInit() {
    }

    public isInternal(bubble: Bubble): boolean {
        return (bubble.type === BubbleType.internalBubble);
    }

    public getBubbleById(id: number): Bubble {
        return getBubbleById(this.bubbleList, id);
    }

    public onClickEvent(bubble: Bubble, menu: MenuType, mouseEvent: MouseEvent): void {
        this._store.dispatch(new BoardAction.Select(this.board));
        this._store.dispatch(new BubbleAction.Select({bubble, menu}));
    }

    public isMenuOpen(bubble: Bubble, menu: MenuType): boolean {
        if (this.selectedBubbleList.length === 1) {
            return (bubble.id === this.selectedBubbleList[0].id) && this.selectedMenu === menu;
        }
    }

    public isSelected(bubble: Bubble) {
        for (const b of this.selectedBubbleList) {
            if (b.id === bubble.id) {
                return true;
            }
        }
        return false;
    }

    public isHover(bubble: Bubble) {
        for (const b of this.hoverBubbleList) {
            if (b.id === bubble.id) {
                return true;
            }
        }
        return false;
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
        this._store.dispatch(new BubbleAction.SelectClear());
    }

  public isBubbleContentShown(bubble: LeafBubble): boolean {
        return (bubble.ownerId === -1) ||
            (bubble.ownerId === 1);
    }
    ngOnDestroy() {
    }

} /* istanbul ignore next */
