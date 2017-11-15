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

  editLock: boolean;

  getEditLock(userId: number): Promise<Bubble>;
  releaseLock(): Promise<void>;

  getHeight(): number;
}

export class LeafBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubble: Bubble;
  location: number;

  comments: Array<Comment>;
  suggestBubbles: Array<SuggestBubble>;

  editLock: boolean;

  owner: number;
  content: string;

  constructor(
    id: number,
    location: number,
    parentBubble: Bubble,
    owner: number = -1,
    content: string = '') {

    this.id = id;
    this.type = BubbleType.leafBubble;
    this.location = location;
    this.comments = [];
    this.parentBubble = parentBubble;
    this.suggestBubbles = [];
    this.editLock = (owner === -1); // edit lock false if no owner
    this.owner = owner;
    this.content = content;
  }

  getEditLock(userId: number): Promise<Bubble> {
    if (this.editLock) {
      return Promise.reject(this);
    }
  }

  releaseLock(): Promise<void> {
    return null;
  }

  getHeight(): number {
    return null;
  }

  split(): void {

  }
}

export class InternalBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubble: Bubble;
  location: number;

  comments: Array<Comment>;
  suggestBubbles: Array<SuggestBubble>;

  editLock: boolean;

  childBubbles: Array<Bubble>;

  constructor(
    id: number,
    location: number,
    parentBubble: Bubble,
    content: string = '',
    childBubbles: Array<Bubble> = []) {

    this.id = id;
    this.type = BubbleType.internalBubble;
    this.location = location;
    this.comments = [];
    this.parentBubble = parentBubble;
    this.suggestBubbles = [];
    this.editLock = false;
    this.childBubbles = childBubbles;
  }

  getEditLock(userId: number): Promise<Bubble> {
    return null;
  }

  releaseLock(): Promise<void> {
    return null;
  }

  getHeight(): number {
    return null;
  }

  // ----

  flatten(): Promise<Bubble> {
    return null;
  }

  addChild(bubble: Bubble, location: number): Promise<Bubble> {
    return null;
  }

  deleteChild(): void {
    return null;
  }

  wrapChildren(wrapList: Array<Bubble>): Promise<Bubble> {
    return null;
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
