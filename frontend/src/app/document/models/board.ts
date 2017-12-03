import { BubbleTemp } from './bubble-temp';

const tempUserID = 1;

export class Board {
}

export class EditItem {
  id: number;
  bubble: BubbleTemp;
  content: string;

  constructor(id: number, bubble: BubbleTemp) {
    this.id = id;
    this.bubble = bubble;
    this.content = '';
  }

} /* istanbul ignore next */
