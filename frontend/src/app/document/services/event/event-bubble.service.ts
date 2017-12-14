import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Bubble, LeafBubble } from '../../models/bubble';

const tempUserId = 1;
@Injectable()
export class EventBubbleService {

}

export enum MenuType {
  borderTopMenu = 1,
  borderBottomMenu,
  leafMenu,
  internalMenu,
  topMenu,
  noMenu,
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
