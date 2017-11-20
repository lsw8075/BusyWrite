import { Note } from './note';
import { Comment } from './comment';

export enum BubbleType {
  leafBubble,
  internalBubble,
  suggestBubble
} /* istanbul ignore next */

export interface Bubble {
  id: number;
  type: BubbleType;
  parentBubble: InternalBubble;
  location: number;

  comments: Array<Comment>;
  suggestBubbles: Array<SuggestBubble>;

  getHeight(): number;

  // addSuggestBubble(SB: Bubble): void;
  // addComment(comment: Comment): void;
  // deleteSuggestBubble(SB: Bubble): void;
  // deleteComment(comment: Comment): void;

  getContent(): string;
  isBeingEditted(): boolean;
  // getComments(): Array<Comment>;
  // getSuggestBubbles(): Array<SuggestBubble>;
} /* istanbul ignore next */

export class LeafBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubble: InternalBubble = null;
  location: number;

  comments: Array<Comment> = [];
  suggestBubbles: Array<SuggestBubble> = [];

  private editLock: boolean;

  ownerId: number;
  content: string;

  constructor(
    id: number,
    content: string = '',
    ownerId: number = -1,
    suggestBubbles: Array<SuggestBubble> = []) {

    this.id = id;
    this.type = BubbleType.leafBubble;
    this.location = -1; // location is -1 when orphan
    this.editLock = (ownerId !== -1); // edit lock false if no owner
    this.content = content;
    this.ownerId = ownerId;
    this.suggestBubbles = suggestBubbles;
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

  isBeingEditted(): boolean {
    return this.editLock;
  }

  whoIsEditting(): number {
    return this.ownerId;
  }

  getHeight(): number {
    const leafBubbleHeight = 1;
    return leafBubbleHeight;
  }

  // split(): void {

  // }

  // addSuggestBubble(SB: Bubble): void {

  // }
  // addComment(comment: Comment): void {

  // }

  // deleteSuggestBubble(SB: Bubble): void {

  // }
  // deleteComment(comment: Comment): void {

  // }

  getContent(): string {
    return this.content;
  }

  // getComments(): Array<Comment> {
  //   return null;
  // }
  // getSuggestBubbles(): Array<SuggestBubble> {
  //   return null;
  // }
} /* istanbul ignore next */

export class InternalBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubble: InternalBubble = null;
  location: number;

  comments: Array<Comment> = [];
  suggestBubbles: Array<SuggestBubble> = [];

  childBubbles: Array<Bubble> = [];

  constructor(
    id: number,
    childBubbles: Array<Bubble>,
    suggestBubbles: Array<SuggestBubble> = []) {

    this.id = id;
    this.type = BubbleType.internalBubble;
    this.location = -1;
    this.addChildren(...childBubbles);
    this.suggestBubbles = suggestBubbles;
  }

  getHeight(): number {
    return this.childBubbles.reduce((prev, curr) => Math.max(prev, curr.getHeight() + 1), 1);
  }

  // addSuggestBubble(SB: Bubble): void {

  // }
  // addComment(comment: Comment): void {

  // }

  // deleteSuggestBubble(SB: Bubble): void {

  // }
  // deleteComment(comment: Comment): void {

  // }

  getContent(): string {
    return this.childBubbles.reduce((prev, curr) => prev + curr.getContent() + '\n', '').slice(0, -1);
  }
  // getComments(): Array<Comment> {
  //   return null;
  // }
  // getSuggestBubbles(): Array<SuggestBubble> {
  //   return null;
  // }

  // ----

  isBeingEditted(): boolean {
    return this.childBubbles.reduce((prev, curr) => prev || curr.isBeingEditted(), false);
  }

insertChildren(location: number, ...bubbles: Array<Bubble>): void {
    if ((location < 0) || (location > this.childBubbles.length + 1)) {
      throw new Error(`location ${location} is invalid`);
    } else {
      let newLocation = location;
      bubbles.forEach(bubble => {
        bubble.parentBubble = this;
        bubble.location = newLocation;
        newLocation++;
      });
      this.childBubbles.splice(location, 0, ...bubbles);
      while (newLocation < this.childBubbles.length) {
        this.childBubbles[newLocation].location = newLocation;
        newLocation++;
      }
    }

  }

  addChildren(...bubbles: Array<Bubble>): void {
    let location = this.childBubbles.length;
    for (const bubble of bubbles) {
      bubble.location = location;
      bubble.parentBubble = this;
      location++;
      this.childBubbles.push(bubble);
    }
  }

deleteChild(childBubble: Bubble): void {
    if (this._ischildBubble(childBubble)) {
      let location = childBubble.location;
      childBubble = null;
      this.childBubbles.splice(location, 1);
      while (location < this.childBubbles.length) {
        this.childBubbles[location].location--;
        location ++;
      }
    } else {
      const errorMsg = `bubble(id: ${childBubble.id}) is not child of bubble(id: ${this.id})`;
      throw new Error(errorMsg);
     }
  }

wrapChildren(wrapList: Array<Bubble>): InternalBubble {

    // no bubble to wrap
    if (wrapList.length < 1) {
      throw new Error('wrapList contains no bubble');
    }

    // some bubble is not child
    for (const bubble of wrapList) {
      if (!this._ischildBubble(bubble)) {
        const errorMsg = `given bubbles are not child`;
        throw new Error(errorMsg);
      }
    }

    // sort bubbles in order
    this._sortByLocation(wrapList);
    let startLocation = wrapList[0].location;
    const startBubbleId = wrapList[0].id;

    // check for un-adjacency
    let locationChecker = startLocation;
    for (const bubble of wrapList) {
      if (bubble.location !== locationChecker) {
        throw new Error('given bubbles are un-ajacent');
      }
      locationChecker ++;
    }

    // if wrap all children, return null, do nothing
    if (this.childBubbles.length === wrapList.length) {
      return null;
    }

    // make internal node
    const wrapBubble: InternalBubble = new InternalBubble(startBubbleId, wrapList);
    wrapBubble.location = startLocation;
    wrapBubble.parentBubble = this;
    // delete un-needed node
    this.childBubbles.splice(startLocation, wrapList.length, wrapBubble);

    // update location of rest bubbles
    startLocation ++;
    while (startLocation < this.childBubbles.length) {
      this.childBubbles[startLocation].location = startLocation;
      startLocation++;
    }
    return wrapBubble;
  }

  flattenChild(bubble: Bubble): LeafBubble {
    if (this._ischildBubble(bubble) && (bubble.type === BubbleType.internalBubble)) {
      const id = bubble.id;
      const location = bubble.location;
      const content = bubble.getContent();
      const newLeaf: LeafBubble = new LeafBubble(id, content);
      newLeaf.location = location;
      newLeaf.parentBubble = this;
      this.childBubbles.splice(location, 1, newLeaf);

      return newLeaf;
    } else if (bubble.type === BubbleType.leafBubble) {
      throw new Error(`can't flatten leaf bubble`);
    } else {
      const errorMsg = `bubble(id: ${bubble.id}) is not child of bubble(id: ${this.id})`;
      throw new Error(errorMsg);
    }
  }

  public popChild(bubble: Bubble): void {
    if (this._ischildBubble(bubble) && (bubble.type === BubbleType.internalBubble)) {
      const newChildren = (bubble as InternalBubble).childBubbles;
      const location = bubble.location;
      this.deleteChild(bubble);
      this.insertChildren(location, ...newChildren);
    } else if (bubble.type === BubbleType.leafBubble) {
      throw new Error(`can't pop leaf bubble`);
    } else {
      const errorMsg = `bubble(id: ${bubble.id}) is not child of bubble(id: ${this.id})`;
      throw new Error(errorMsg);
    }
  }
  private _ischildBubble(bubble: Bubble): boolean {
    if (bubble.parentBubble === null) {
      return false;
    } else {
      return bubble.parentBubble.id === this.id;
    }
  }

  private _sortByLocation(bubbleList: Array<Bubble>) {
    bubbleList.sort(function(a: Bubble, b: Bubble) {
      return a.location - b.location;
    });
  }
} /* istanbul ignore next */

export class SuggestBubble {
  id: number;
  type: BubbleType;
  content: string;
  comments: Array<Comment>;

   constructor(
     id: number,
     content: string,
     comments: Array<Comment>
   ) {
     // must initialize all attributes
     this.type = BubbleType.suggestBubble;
     this.id = id;
     this.content = content;
     this.comments = comments;
   }
} /* istanbul ignore next */
