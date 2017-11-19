import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Bubble } from '../../model/bubble';

@Injectable()
export class EventBubbleService {

  private actionState: ActionType;
  private selectState: SelectState;
  selectedBubble: Bubble;
  selectedMenuType: MenuType;

  wrapBubbles: Array<Bubble> = [];

  private _sangjunBoardOpenEventSource = new Subject<Bubble>();
  private _splitBubbleEventSource = new Subject<Bubble>();
  private _popBubbleEventSource = new Subject<Bubble>();
  private _wrapBubbleEventSource = new Subject<Bubble>();
  private _createBubbleEventSource = new Subject<{bubble: Bubble, menu: MenuType}>();
  private _editBubbleEventSource = new Subject<Bubble>();
  private _deleteBubbleEventSource = new Subject<Bubble>();
  private _flattenBubbleEventSource = new Subject<Bubble>();

  sangjunBoardOpenEvent$ = this._sangjunBoardOpenEventSource.asObservable();
  splitBubbleEvent$ = this._splitBubbleEventSource.asObservable();
  popBubbleEvent$ = this._popBubbleEventSource.asObservable();
  wrapBubbleEvent$ = this._wrapBubbleEventSource.asObservable();
  createBubbleEvent$ = this._createBubbleEventSource.asObservable();
  editBubbleEvent$ = this._editBubbleEventSource.asObservable();
  deleteBubbleEvent$ = this._deleteBubbleEventSource.asObservable();
  flattenBubbleEvent$ = this._flattenBubbleEventSource.asObservable();

  constructor() {
    this.actionState = ActionType.none;
    this.selectState = SelectState.none;
    this.selectedBubble = null;
    console.log('state initialized to none');
  }

  public setState(nextState: ActionType) {
    this.actionState = nextState;
    if (this.actionState === ActionType.wrap) {
      this.wrapBubbles.push(this.selectedBubble);
      this.selectedBubble = null;
      this.selectState = SelectState.multipleSelect;
    }
  }

  public getActionState(): ActionType {
    return this.actionState;
  }

  public clearState(): void {
    this.selectedBubble = null;
    this.selectedMenuType = null;
    this.wrapBubbles = [];
    this.actionState = ActionType.none;
    this.selectState = SelectState.none;
  }

  public selectBubble(bubble: Bubble, menu: MenuType): void {
    if (this.selectState !== SelectState.multipleSelect) {
      console.log('select buble');
      this.selectState = SelectState.singleSelect;
      this.selectedBubble = bubble;
      this.selectedMenuType = menu;
    } else if (this.selectState === SelectState.multipleSelect &&
        this.wrapBubbles[0].parentBubble.id === bubble.parentBubble.id) {
          if (this._isBubbleInWrapList(bubble)) {
            this.wrapBubbles = this.wrapBubbles.filter(b => b.id !== bubble.id);
          } else {
            this.wrapBubbles.push(bubble);
          }
    } else {
      this.clearState();
    }
  }

  public isBubbleSelected(bubble: Bubble): boolean {
    if (this.selectState === SelectState.singleSelect &&
        bubble.id === this.selectedBubble.id) {
         return true;
    } else if (this.selectState === SelectState.multipleSelect) {
      return this._isBubbleInWrapList(bubble);
    } else {
      return false;
    }
  }

  public isMenuOpen(bubble: Bubble, menu: MenuType): boolean {
    if (this.selectState === SelectState.singleSelect) {
      if ((bubble.id === this.selectedBubble.id) &&
          (menu === this.selectedMenuType)) {
          return true;
      } else {
        return false;
      }
    }
  }

  private _isBubbleInWrapList(bubble: Bubble): boolean {
    for (const b of this.wrapBubbles) {
      if (b.id === bubble.id) {
        return true;
      }
    }
    return false;
  }


  openSangjunBoard(bubble: Bubble): void {
    this._sangjunBoardOpenEventSource.next(bubble);
  }

  splitBubble(bubble: Bubble): void {
    this._splitBubbleEventSource.next(bubble);
  }

  popBubble(bubble: Bubble): void {
    this._popBubbleEventSource.next(bubble);
  }

  wrapBubble(bubble: Bubble): void {
    this._wrapBubbleEventSource.next(bubble);
  }

  createBubble(bubble: Bubble, menu: MenuType): void {
    this._createBubbleEventSource.next({bubble, menu});
  }

  editBubble(bubble: Bubble): void {
    this._editBubbleEventSource.next(bubble);
  }

  deleteBubble(bubble: Bubble): void {
    this._deleteBubbleEventSource.next(bubble);
  }

  flattenBubble(bubble: Bubble): void {
    this._flattenBubbleEventSource.next(bubble);
  }
}

export enum MenuType {
  borderTopMenu = 1,
  borderBottomMenu,
  leafMenu,
  internalMenu,
  multipleBubble,
}

export enum ActionType {
  none = 1,
  openSangjun,
  split,
  pop,
  wrap,
  create,
  edit,
  delete,
  flatten,
  insertNode
}

enum SelectState {
  none = 1,
  singleSelect,
  multipleSelect
}
