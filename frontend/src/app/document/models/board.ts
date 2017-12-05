import { Bubble } from './bubble';

const tempUserID = 1;

export enum BoardType {
    view = 1,
    edit,
    suggest,
    filter,
}

export class Board {
    type: BoardType;

}

export class EditItem {
  id: number;
  bubble: Bubble;
  content: string;

  constructor(id: number, bubble: Bubble) {
    this.id = id;
    this.bubble = bubble;
    this.content = '';
  }

} /* istanbul ignore next */
