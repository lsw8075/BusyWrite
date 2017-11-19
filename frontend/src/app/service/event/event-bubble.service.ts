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

  private sangjunBoardOpenEventSource = new Subject<Bubble>();
  private bubbleSplitEventSource = new Subject<Bubble>();

  sangjunBoardOpenEvent$ = this.sangjunBoardOpenEventSource.asObservable();
  splitBubbleEvent$ = this.bubbleSplitEventSource.asObservable();

  openSangjunBoard(bubble: Bubble) {
    this.sangjunBoardOpenEventSource.next(bubble);
  }

  splitBubble(bubble: Bubble) {
    this.bubbleSplitEventSource.next(bubble);
  }
}
