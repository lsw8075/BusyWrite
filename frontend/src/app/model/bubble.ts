import { Note } from './note';

export interface Bubble {
  id: number;
  comments: Array<number>;
}

export class LeafBubble implements Bubble {
  id: number;
  content: string;
  location: number;
  owner: number;
  editLock: boolean;

  parentID: number;
  suggestBubbles: Array<number>;
  comments: Array<number>;

  constructor() {
    // must initialize all attributes
    throw new Error('not implemented');
  }

  public noteToLeafBubble(note: Note): LeafBubble {
    throw new Error('not implemented');
    // return new LeafBubble();
  }
}

export class InternalBubble implements Bubble {
  id: number;
  location: number;
  editLock: boolean;

  parentID: number;
  suggestBubbles: Array<number>;
  childBubbles: Array<number>;
  comments: Array<number>;

  constructor() {
    // must initialize all attributes
    throw new Error('not implemented');
  }
}

export class SuggestBubble implements Bubble {
  id: number;
  content: string;
  location: number;

  comments: Array<number>;

  constructor() {
    // must initialize all attributes
    throw new Error('not implemented');
  }

  public noteToSuggestBubble(note: Note): SuggestBubble {
    throw new Error('not implemented');
    // return new LeafBubble();
  }
}
