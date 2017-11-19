import { Bubble } from './bubble';

export class Board {
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
}
