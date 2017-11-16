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

  getEditLock(userId: number): boolean;
  releaseLock(): void;

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
    location: number,
    parentBubble: Bubble,
    ownerId: number = -1,
    content: string = '') {

    this.id = id;
    this.type = BubbleType.leafBubble;
    this.location = location;
    this.comments = [];
    this.parentBubble = parentBubble;
    this.suggestBubbles = [];
    this.editLock = (ownerId === -1); // edit lock false if no owner
    this.ownerId = ownerId;
    this.content = content;
  }

  getEditLock(userId: number): boolean {
    if (this.editLock) {
      return false;
    } else {
      this.ownerId = userId;
      this.editLock = true;
      return true;
    }
  }

  releaseLock(): void {
    return null;
  }

  getHeight(): number {
    return null;
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
    return null;
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

  editLock: boolean;

  childBubbles: Array<Bubble>;

  constructor(
    id: number,
    location: number,
    parentBubble: Bubble,
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

  getEditLock(userId: number): boolean {
    return null;
  }

  releaseLock(): void {
    return null;
  }

  getHeight(): number {
    return null;
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
    return null;
  }
  getComments(): Array<Comment> {
    return null;
  }
  getSuggestBubbles(): Array<SuggestBubble> {
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
