export { BubbleService, BoardService } from '../service';
export { Board } from '../service';
export { BubbleType, Bubble, SuggestBubble } from '../service';
export { EventBubbleService } from '../service';

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
