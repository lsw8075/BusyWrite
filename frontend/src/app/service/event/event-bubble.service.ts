import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Bubble } from '../../model/bubble';

export enum MenuType {
  borderTopMenu = 1,
  borderBottomMenu,
  leafMenu,
  internalMenu,
  multipleBubble,
}

export enum ActionType {
  openSangjun = 1,
  split,
  pop,
  wrap,
  create,
  edit,
  delete,
}

@Injectable()
export class EventBubbleService {

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
