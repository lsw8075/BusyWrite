import { Bubble } from './bubble';

const tempUserID = 1;

export enum BoardType {
    view = 1,
    edit,
    suggest,
    filter,
}

export enum BoardLocation {
    left = 1,
    right,
    hidden,
    closed,
    hover
}

export class Board {
    constructor(
        public type: BoardType,
        public location: BoardLocation,
        public id: number) {}
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
