import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Bubble, LeafBubble } from '../../model/bubble';

const tempUserId = 1;
@Injectable()
export class EventBubbleService {

  private actionState: ActionType;
  private selectState: SelectState;

  selectedBubble: Bubble;
  selectedMenuType: MenuType;

  edittedBubble: Bubble;

  wrapBubbles: Array<Bubble> = [];

  private _sangjunBoardOpenEventSource = new Subject<Bubble>();
  private _splitBubbleEventSource = new Subject<void>();
  private _popBubbleEventSource = new Subject<Bubble>();
  private _wrapBubbleEventSource = new Subject<void>();
  private _createBubbleEventSource = new Subject<{bubble: Bubble, menu: MenuType}>();
  private _editBubbleEventSource = new Subject<Bubble>();
  private _deleteBubbleEventSource = new Subject<Bubble>();
  private _flattenBubbleEventSource = new Subject<Bubble>();
  private _moveBubbleEventSource = new Subject<{moveBubble: Bubble, destBubble: Bubble, menu: MenuType}>();

  sangjunBoardOpenEvent$ = this._sangjunBoardOpenEventSource.asObservable();
  splitBubbleEvent$ = this._splitBubbleEventSource.asObservable();
  popBubbleEvent$ = this._popBubbleEventSource.asObservable();
  wrapBubbleEvent$ = this._wrapBubbleEventSource.asObservable();
  createBubbleEvent$ = this._createBubbleEventSource.asObservable();
  editBubbleEvent$ = this._editBubbleEventSource.asObservable();
  deleteBubbleEvent$ = this._deleteBubbleEventSource.asObservable();
  flattenBubbleEvent$ = this._flattenBubbleEventSource.asObservable();
  moveBubbleEvent$ = this._moveBubbleEventSource.asObservable();

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
      this.selectState = SelectState.wrapSelect;
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
    if (this.selectState === SelectState.singleSelect ||
        this.selectState === SelectState.none) {
      this.selectState = SelectState.singleSelect;
      this.selectedBubble = bubble;
      this.selectedMenuType = menu;
    } else if (this.selectState === SelectState.wrapSelect &&
        this.wrapBubbles[0].parentBubble.id === bubble.parentBubble.id) {
          if (this._isBubbleInWrapList(bubble)) {
            this.wrapBubbles = this.wrapBubbles.filter(b => b.id !== bubble.id);
            if (this.wrapBubbles.length === 0) {
              // if no bubbles are selected for wrap
              this.clearState();
            }
          } else {
            this.wrapBubbles.push(bubble);
          }
    } else if (this.selectState === SelectState.moveSelect) {
        if (menu === MenuType.borderBottomMenu ||
            menu === MenuType.borderTopMenu) {
          const destBubble = bubble;
          const moveBubble = this.selectedBubble;
          this._moveBubbleEventSource.next({moveBubble, destBubble, menu});
        }
    } else {
      this.clearState();
    }
  }

  public isBubbleSelected(bubble: Bubble): boolean {
    if (this.selectState === SelectState.singleSelect &&
        bubble.id === this.selectedBubble.id) {
         return true;
    } else if (this.selectState === SelectState.wrapSelect) {
      return this._isBubbleInWrapList(bubble);
    } else {
      return false;
    }
  }

  public isBeingEditted(bubble: Bubble): boolean {
    if (this.edittedBubble) {
      return this.edittedBubble.id === bubble.id;
    }
  }

  public isMenuOpen(bubble: Bubble, menu: MenuType): boolean {
    if (this.selectState === SelectState.singleSelect &&
        this.actionState === ActionType.none) {
      if ((bubble.id === this.selectedBubble.id) &&
          (menu === this.selectedMenuType)) {
          return true;
      } else {
        return false;
      }
    }
  }

  public unsubscribeAll(): void {
    this._sangjunBoardOpenEventSource.complete();
    this._splitBubbleEventSource.complete();
    this._popBubbleEventSource.complete();
    this._wrapBubbleEventSource.complete();
    this._createBubbleEventSource.complete();
    this._editBubbleEventSource.complete();
    this._deleteBubbleEventSource.complete();
    this._flattenBubbleEventSource.complete();
    this._moveBubbleEventSource.complete();
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
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.openSangjun);
      this._sangjunBoardOpenEventSource.next(bubble);
    }
  }

  splitBubble(): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.split);
      this._splitBubbleEventSource.next();
    }
  }

  popBubble(bubble: Bubble): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.pop);
      this._popBubbleEventSource.next(bubble);
    }
  }

  wrapBubble(bubble: Bubble): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.wrap);
    }
  }

  wrap(): void {
    this._wrapBubbleEventSource.next();
  }

  createBubble(bubble: Bubble, menu: MenuType): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.create);
      this._createBubbleEventSource.next({bubble, menu});
    }
  }

  editBubble(bubble: Bubble): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.edit);
      this._editBubbleEventSource.next(bubble);
    }
  }

  deleteBubble(bubble: Bubble): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.delete);
      this._deleteBubbleEventSource.next(bubble);
    }
  }

  flattenBubble(bubble: Bubble): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.flatten);
      this._flattenBubbleEventSource.next(bubble);
    }
  }

  moveBubble(bubble: Bubble, menu: MenuType): void {
    if (this.actionState === ActionType.none) {
      this.setState(ActionType.move);
      this.selectState = SelectState.moveSelect;
    }
  }
}

export enum MenuType {
  borderTopMenu = 1,
  borderBottomMenu,
  leafMenu,
  internalMenu,
  topMenu
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
  insertNode,
  move
}

enum SelectState {
  none = 1,
  singleSelect,
  wrapSelect,
  moveSelect
}
