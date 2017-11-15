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
  location: number;
  comments: Array<Comment>;
  parentBubble: Bubble;
  suggestBubbles: Array<number>;

  editLock: boolean;

  getEditLock(userId: number): Promise<Bubble>;
  releaseLock(): Promise<null>;
}

export class LeafBubble implements Bubble {
  id: number;
  type: BubbleType;
  location: number;
  comments: Array<Comment>;
  parentBubble: Bubble;
  suggestBubbles: Array<number>;

  editLock: boolean;

  owner: number;
  content: string;

  constructor(id: number, location: number, content?: string) {
    this.type = BubbleType.leafBubble;
  }

  getEditLock(userId: number): Promise<Bubble> {
    if (this.editLock) {
      return Promise.reject(this);
    }
  }

  releaseLock(): Promise<null> {
    return null;
  }

  // public noteToLeafBubble(note: Note): LeafBubble {
  //   throw new Error('not implemented');
  //   // return new LeafBubble();
  // }
}

export class InternalBubble implements Bubble {
  id: number;
  type: BubbleType;
  location: number;
  comments: Array<Comment>;
  parentBubble: Bubble;
  suggestBubbles: Array<number>;

  editLock: boolean;

  childBubbleList: Array<Bubble>;

  constructor() {
    // must initialize all attributes
    this.type = BubbleType.internalBubble;
  }

  getEditLock(userId: number): Promise<Bubble> {
    return null;
  }

  releaseLock(): Promise<null> {
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

  // public noteToSuggestBubble(note: Note): SuggestBubble {
  //   throw new Error('not implemented');
  //   // return new LeafBubble();
  // }
}
