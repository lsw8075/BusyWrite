import { Note } from './note';
import { Comment } from './comment';

export enum BubbleType {
  leafBubble,
  internalBubble,
  suggestBubble
}

export interface Bubble {
  id: number;
  type: BubbleType;
  parentBubble: Bubble;
  location: number;

  comments: Array<Comment>;
  suggestBubbles: Array<SuggestBubble>;

  getHeight(): number;

  addSuggestBubble(SB: Bubble): void;
  addComment(comment: Comment): void;
  deleteSuggestBubble(SB: Bubble): void;
  deleteComment(comment: Comment): void;

  getContent(): string;
  getComments(): Array<Comment>;
  getSuggestBubbles(): Array<SuggestBubble>;
}

export class LeafBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubble: Bubble;
  location: number;

  comments: Array<Comment>;
  suggestBubbles: Array<SuggestBubble>;

  editLock: boolean;

  ownerId: number;
  content: string;

  constructor(
    id: number,
    parentBubble: Bubble,
    content: string = '',
    ownerId: number = -1) {

    this.id = id;
    this.type = BubbleType.leafBubble;
    this.comments = [];
    this.parentBubble = parentBubble;
    this.location = -1; // location is -1 when orphan
    this.suggestBubbles = [];
    this.editLock = (ownerId !== -1); // edit lock false if no owner
    this.ownerId = ownerId;
    this.content = content;
  }

  getEditLock(userId: number): boolean {
    if (this.editLock && this.ownerId !== userId) {
      return false;
    } else if (this.ownerId === userId) {
      return true;
    } else {
      this.ownerId = userId;
      this.editLock = true;
      return true;
    }
  }

  releaseLock(): void {
    this.ownerId = -1;
    this.editLock = false;
  }

  getHeight(): number {
    const leafBubbleHeight = 1;
    return leafBubbleHeight;
  }

  split(): void {

  }

  addSuggestBubble(SB: Bubble): void {

  }
  addComment(comment: Comment): void {

  }

  deleteSuggestBubble(SB: Bubble): void {

  }
  deleteComment(comment: Comment): void {

  }

  getContent(): string {
    return this.content;
  }

  getComments(): Array<Comment> {
    return null;
  }
  getSuggestBubbles(): Array<SuggestBubble> {
    return null;
  }
}

export class InternalBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubble: Bubble;
  location: number;

  comments: Array<Comment>;
  suggestBubbles: Array<SuggestBubble>;

  childBubbles: Array<Bubble>;

  constructor(
    id: number,
    parentBubble: Bubble,
    childBubbles: Array<Bubble> = []) {

    this.id = id;
    this.type = BubbleType.internalBubble;
    this.location = -1;
    this.comments = [];
    this.parentBubble = parentBubble;
    this.suggestBubbles = [];
    this.childBubbles = childBubbles;
  }

  getHeight(): number {
    return this.childBubbles.reduce((prev, curr) => Math.max(prev, curr.getHeight() + 1), 1);
  }

  addSuggestBubble(SB: Bubble): void {

  }
  addComment(comment: Comment): void {

  }

  deleteSuggestBubble(SB: Bubble): void {

  }
  deleteComment(comment: Comment): void {

  }

  getContent(): string {
    return this.childBubbles.reduce((prev, curr) => prev + curr.getContent() + '\n', '').slice(0, -1);
  }
  getComments(): Array<Comment> {
    return null;
  }
  getSuggestBubbles(): Array<SuggestBubble> {
    return null;
  }

  // ----

  insertChild(bubble: Bubble, location: number): void {
    if ((location < 0) || (location > this.childBubbles.length + 1)) {
      throw new Error(`location ${location} is invalid`);
    } else {
      bubble.parentBubble = this;
      this.childBubbles.splice(location, 0, bubble);
      bubble.location = location;
      location++;
      while (location < this.childBubbles.length) {
        this.childBubbles[location].location++;
        location++;
      }
    }

  }

  addChildren(...bubbles: Array<Bubble>): void {
    let location = this.childBubbles.length;
    for (let bubble of bubbles) {
      if (this._ischildBubble(bubble)) {
        bubble.location = location;
        location++;
        this.childBubbles.push(bubble);
      }
    }
  }

  deleteChild(childBubble: Bubble): void {
    return null;
  }

  wrapChildren(wrapList: Array<Bubble>): InternalBubble {
    return null;
  }

  private _ischildBubble(bubble: Bubble): boolean {
    return bubble.parentBubble.id === this.id;
  }

  private _sortByLocation(bubbleList: Array<Bubble>) {

  }
}

export class SuggestBubble {
  id: number;
  type: BubbleType;
  content: string;
  location: number;

  comments: Array<Comment>;

  // constructor() {
  //   // must initialize all attributes
  //   this.type = BubbleType.suggestBubble;
  // }
}
