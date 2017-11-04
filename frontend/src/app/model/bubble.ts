import { Note } from './note';

export enum BubbleType {
  leafBubble,
  internalBubble,
  suggestBubble
}

export interface Bubble {
  id: number;
  type: BubbleType;
  location: number;
  comments: Array<number>;
}

export class LeafBubble implements Bubble {
  id: number;
  type: BubbleType;
  content: string;
  location: number;
  owner: number;
  editLock: boolean;

  parentID: number;
  suggestBubbles: Array<number>;
  comments: Array<number>;

  constructor() {
    this.type = BubbleType.leafBubble;
  }

  public noteToLeafBubble(note: Note): LeafBubble {
    throw new Error('not implemented');
    // return new LeafBubble();
  }
}

export class InternalBubble implements Bubble {
  id: number;
  type: BubbleType;
  location: number;
  editLock: boolean;

  parentID: number;
  suggestBubbles: Array<number>;
  childBubbles: Array<number>;
  comments: Array<number>;

  constructor() {
    // must initialize all attributes
    this.type = BubbleType.internalBubble;
    throw new Error('not implemented');
  }
}

export class SuggestBubble implements Bubble {
  id: number;
  type: BubbleType;
  content: string;
  location: number;

  comments: Array<number>;

  constructor() {
    // must initialize all attributes
    this.type = BubbleType.suggestBubble;
    throw new Error('not implemented');
  }

  public noteToSuggestBubble(note: Note): SuggestBubble {
    throw new Error('not implemented');
    // return new LeafBubble();
  }
}
