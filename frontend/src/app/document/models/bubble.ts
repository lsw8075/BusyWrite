import { Note } from './note';
import { Comment } from './comment';
import { User } from '../../user/models/user';

export enum BubbleType {
  leafBubble,
  internalBubble,
  suggestBubble
} /* istanbul ignore next */

export class Suggest {
    isBindSuggest: boolean;
    bindBubbleId: number;
    content: string;

    constructor(
        isBindSuggest: boolean = false,
        bindBubbleId: number = -1,
        content: string = "") {
        this.isBindSuggest = isBindSuggest;
        this.bindBubbleId = bindBubbleId;
        this.content = content;
    }
}

export class Bubble {
  id: number;
  type: BubbleType;
  parentBubbleId: number;
  location: number;
  thumbUps: number;

  commentIds: Array<number>;
  suggestBubbleIds: Array<number>;
  watchUserIds: Array<number>;
} /* istanbul ignore next */

export class LeafBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubbleId = -1;
  location: number;
  thumbUps: number;

  commentIds: Array<number> = [];
  suggestBubbleIds: Array<number> = [];
  watchUserIds: Array<number> = [];

  editLock: boolean;
  editLockHolder: number;
  ownerId: number;
  content: string;

  constructor(
    id: number,
    content: string = '',
    ownerId: number = -1,
    suggestBubbleIds: Array<number> = [],
    commentIds: Array<number> = [],
    watchUserIds: Array<number> = [],
    thumbUps: number = 0,
    editLockHolder: number = -1) {

    this.id = id;
    this.type = BubbleType.leafBubble;
    this.location = -1; // location is -1 when orphan
    this.editLock = (ownerId === -1) ? false : true; // edit lock false if no owner
    this.content = content;
    this.ownerId = ownerId;
    this.suggestBubbleIds = suggestBubbleIds;
    this.commentIds = commentIds;
    this.watchUserIds = watchUserIds;
    this.thumbUps = thumbUps;
    this.editLockHolder = editLockHolder;
  }

  public getEditLock(): boolean {
      return this.editLock;
  }
} /* istanbul ignore next */

export class InternalBubble implements Bubble {
  id: number;
  type: BubbleType;
  parentBubbleId = -1;
  location: number;
  thumbUps: number;

  commentIds: Array<number> = [];
  suggestBubbleIds: Array<number> = [];
  watchUserIds: Array<number> = [];

  childBubbleIds: Array<number> = [];

  constructor(
    id: number,
    childBubbleIds: Array<number> = [],
    suggestBubbleIds: Array<number> = [],
    commentIds: Array<number> = [],
    watchUserIds: Array<number> = [],
    thumbUps: number = 0) {

    this.id = id;
    this.type = BubbleType.internalBubble;
    this.location = -1;
    this.childBubbleIds = childBubbleIds;
    this.suggestBubbleIds = suggestBubbleIds;
    this.commentIds = commentIds;
    this.thumbUps = thumbUps;
    this.watchUserIds = watchUserIds;
  }
} /* istanbul ignore next */

export class SuggestBubble {
  id: number;
  type: BubbleType;
  content: string;
  commentIds: Array<number>;
  thumbUps: number;

  // related to UI
  isMouseOver: boolean;
  isSelected: boolean;

  hidden: boolean;

  bindId: number;

  constructor(
    id: number,
    content: string,
    bindId: number,
    hidden: boolean = false,
    commentIds: Array<number> = [],
    thumbUps: number = 0,
  ) {
    // must initialize all attributes
    this.type = BubbleType.suggestBubble;
    this.id = id;
    this.content = content;
    this.bindId = bindId;
    this.hidden = hidden;
    this.commentIds = commentIds;
    this.thumbUps = thumbUps;
  }
} /* istanbul ignore next */
