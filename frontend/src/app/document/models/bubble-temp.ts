// import { Note } from './note';
// import { Comment } from './comment';
// import { User } from '../../user/models/user';

// export enum BubbleType {
//   leafBubble,
//   internalBubble,
//   suggestBubble
// } /* istanbul ignore next */

// export interface BubbleTemp {
//   id: number;
//   type: BubbleType;
//   parentBubble: InternalBubbleTemp;
//   location: number;
//   thumbUps: number;

//   comments: Array<Comment>;
//   suggestBubbles: Array<SuggestBubbleTemp>;
//   watchUsers: Array<User>;

//   isMouseOver: boolean;

//   releaseLock(): void;

//   getHeight(): number;
//   mouseOver(over: boolean): void;
//   clearMouseEvent(): void;

//   addSuggestBubble(suggestBubble: SuggestBubbleTemp): void;
//   addComment(comment: Comment): void;
//   deleteSuggestBubble(suggestBubble: SuggestBubbleTemp): void;
//   deleteComment(comment: Comment): void;

//   getContent(): string;
//   isBeingEditted(): boolean;
//   getComments(): Array<Comment>;
//   getSuggestBubbles(): Array<SuggestBubbleTemp>;
// } /* istanbul ignore next */

// export class LeafBubbleTemp implements BubbleTemp {
//   id: number;
//   type: BubbleType;
//   parentBubble: InternalBubbleTemp = null;
//   location: number;
//   thumbUps: number;

//   isMouseOver: boolean;

//   comments: Array<Comment> = [];
//   suggestBubbles: Array<SuggestBubbleTemp> = [];
//   watchUsers: Array<User> = [];

//   private editLock: boolean;

//   ownerId: number;
//   content: string;

//   constructor(
//     id: number,
//     content: string = '',
//     ownerId: number = -1,
//     suggestBubbles: Array<SuggestBubbleTemp> = [],
//     comments: Array<Comment> = [],
//     watchUsers: Array<User> = [],
//     thumbUps: number = 0) {

//     this.id = id;
//     this.type = BubbleType.leafBubble;
//     this.location = -1; // location is -1 when orphan
//     this.editLock = (ownerId === -1) ? false : true; // edit lock false if no owner
//     this.content = content;
//     this.ownerId = ownerId;
//     this.suggestBubbles = suggestBubbles;
//     this.isMouseOver = false;
//     this.comments = comments;
//     this.watchUsers = watchUsers;
//     this.thumbUps = thumbUps;
//   }

//   getEditLock(userId: number): boolean {
//     if (this.editLock && this.ownerId !== userId) {
//       return false;
//     } else if (this.ownerId === userId) {
//       return true;
//     } else {
//       this.ownerId = userId;
//       this.editLock = true;
//       return true;
//     }
//   }

//   releaseLock(): void {
//     this.ownerId = -1;
//     this.editLock = false;
//   }

//   isBeingEditted(): boolean {
//     return this.editLock;
//   }

//   whoIsEditting(): number {
//     return this.ownerId;
//   }

//   getHeight(): number {
//     const leafBubbleHeight = 1;
//     return leafBubbleHeight;
//   }

//   mouseOver(over: boolean): void {
//     this.isMouseOver = over;
//   }

//   clearMouseEvent(): void {
//     this.isMouseOver = false;
//   }

//   addSuggestBubble(suggestBubble: SuggestBubbleTemp) {
//     this.suggestBubbles.push(suggestBubble);
//   }

//   addComment(comment: Comment) {
//     this.comments.push(comment);
//   }

//   deleteSuggestBubble(suggestBubble: SuggestBubbleTemp) {
//     const index: number = this.suggestBubbles.indexOf(suggestBubble);
//     if (index > -1) {
//       this.suggestBubbles.splice(index, 1);
//     }
//   }

//   deleteComment(comment: Comment) {
//     const index: number = this.comments.indexOf(comment);
//     if (index > -1) {
//       this.comments.splice(index, 1);
//     }
//   }

//   getContent(): string {
//     return this.content;
//   }

//   getComments(): Array<Comment> {
//     return null;
//   }
//   getSuggestBubbles(): Array<SuggestBubbleTemp> {
//     return null;
//   }
// } /* istanbul ignore next */

// export class InternalBubbleTemp implements BubbleTemp {
//   id: number;
//   type: BubbleType;
//   parentBubble: InternalBubbleTemp = null;
//   location: number;
//   thumbUps: number;

//   isMouseOver: boolean;

//   comments: Array<Comment> = [];
//   suggestBubbles: Array<SuggestBubbleTemp> = [];
//   watchUsers: Array<User> = [];

//   childBubbles: Array<BubbleTemp> = [];

//   constructor(
//     id: number,
//     childBubbles: Array<BubbleTemp>,
//     suggestBubbles: Array<SuggestBubbleTemp> = [],
//     comments: Array<Comment> = [],
//     watchUsers: Array<User> = [],
//     thumbUps: number = 0) {

//     this.id = id;
//     this.type = BubbleType.internalBubble;
//     this.location = -1;
//     this.addChildren(...childBubbles);
//     this.suggestBubbles = suggestBubbles;
//     this.isMouseOver = false;
//     this.comments = comments;
//     this.thumbUps = thumbUps;
//     this.watchUsers = watchUsers;
//   }

//   getHeight(): number {
//     return this.childBubbles.reduce((prev, curr) => Math.max(prev, curr.getHeight() + 1), 1);
//   }

//   mouseOver(over: boolean): void {
//     this.isMouseOver = over;
//     if (this.parentBubble !== null) {
//       this.childBubbles.forEach(b => b.mouseOver(over));
//     }
//   }

//   clearMouseEvent(): void {
//     this.isMouseOver = false;
//     this.childBubbles.forEach(b => b.clearMouseEvent());
//   }

//   releaseLock(): void {
//     this.childBubbles.forEach(b => b.releaseLock());
//   }

//   getContent(): string {
//     return this.childBubbles.reduce((prev, curr) => prev + curr.getContent() + '\n', '').slice(0, -1);
//   }

//   getComments(): Array<Comment> {
//     return null;
//   }

//   getSuggestBubbles(): Array<SuggestBubbleTemp> {
//     return null;
//   }

//   addSuggestBubble(suggestBubble: SuggestBubbleTemp) {
//     this.suggestBubbles.push(suggestBubble);
//   }

//   addComment(comment: Comment) {
//     this.comments.push(comment);
//   }

//   deleteSuggestBubble(suggestBubble: SuggestBubbleTemp) {
//     const index: number = this.suggestBubbles.indexOf(suggestBubble);
//     if (index > -1) {
//       this.suggestBubbles.splice(index, 1);
//     }
//   }

//   deleteComment(comment: Comment) {
//     const index: number = this.comments.indexOf(comment);
//     if (index > -1) {
//       this.comments.splice(index, 1);
//     }
//   }

//   // ----

//   isBeingEditted(): boolean {
//     return this.childBubbles.reduce((prev, curr) => prev || curr.isBeingEditted(), false);
//   }

//   insertChildren(location: number, ...bubbles: Array<BubbleTemp>): void {
//     if ((location < 0) || (location > this.childBubbles.length + 1)) {
//       throw new Error(`location ${location} is invalid`);
//     } else {
//       let newLocation = location;
//       bubbles.forEach(bubble => {
//         bubble.parentBubble = this;
//         bubble.location = newLocation;
//         newLocation++;
//       });
//       this.childBubbles.splice(location, 0, ...bubbles);
//       while (newLocation < this.childBubbles.length) {
//         this.childBubbles[newLocation].location = newLocation;
//         newLocation++;
//       }
//     }

//   }

//   addChildren(...bubbles: Array<BubbleTemp>): void {
//     let location = this.childBubbles.length;
//     for (const bubble of bubbles) {
//       bubble.location = location;
//       bubble.parentBubble = this;
//       location++;
//       this.childBubbles.push(bubble);
//     }
//   }

//   deleteChild(childBubble: BubbleTemp): void {
//     if (this._ischildBubble(childBubble)) {
//       let location = childBubble.location;
//       childBubble = null;
//       this.childBubbles.splice(location, 1);
//       while (location < this.childBubbles.length) {
//         this.childBubbles[location].location--;
//         location++;
//       }
//     } else {
//       const errorMsg = `bubble(id: ${childBubble.id}) is not child of bubble(id: ${this.id})`;
//       throw new Error(errorMsg);
//      }
//   }

//   wrapChildren(wrapBubble: InternalBubbleTemp, wrapList: Array<BubbleTemp>): void {
//     // no bubble to wrap
//     if (wrapList.length < 1) {
//       throw new Error('wrapList contains no bubble');
//     }

//     // some bubble is not child
//     for (const bubble of wrapList) {
//       if (!this._ischildBubble(bubble)) {
//         const errorMsg = `given bubbles are not child`;
//         throw new Error(errorMsg);
//       }
//     }

//     // sort bubbles in order
//     this._sortByLocation(wrapList);
//     let startLocation = wrapList[0].location;

//     // check for un-adjacency
//     let locationChecker = startLocation;
//     for (const bubble of wrapList) {
//       if (bubble.location !== locationChecker) {
//         throw new Error('given bubbles are un-ajacent');
//       }
//       locationChecker++;
//     }

//     // if wrap all children, return null, do nothing
//     if (this.childBubbles.length === wrapList.length) {
//       return null;
//     }

//     // make internal node
//     wrapBubble.location = startLocation;
//     wrapBubble.parentBubble = this;
//     wrapBubble.addChildren(...wrapList);
//     // delete un-needed node
//     this.childBubbles.splice(startLocation, wrapList.length, wrapBubble);

//     // update location of rest bubbles
//     startLocation++;
//     while (startLocation < this.childBubbles.length) {
//       this.childBubbles[startLocation].location = startLocation;
//       startLocation++;
//     }
//   }

//   flattenChild(bubble: BubbleTemp): LeafBubbleTemp {
//     if (this._ischildBubble(bubble) && (bubble.type === BubbleType.internalBubble)) {
//       const id = bubble.id;
//       const location = bubble.location;
//       const content = bubble.getContent();
//       const newLeaf: LeafBubbleTemp = new LeafBubbleTemp(id, content);
//       newLeaf.location = location;
//       newLeaf.parentBubble = this;
//       this.childBubbles.splice(location, 1, newLeaf);

//       return newLeaf;
//     } else if (bubble.type === BubbleType.leafBubble) {
//       throw new Error(`can't flatten leaf bubble`);
//     } else {
//       const errorMsg = `bubble(id: ${bubble.id}) is not child of bubble(id: ${this.id})`;
//       throw new Error(errorMsg);
//     }
//   }

//   public popChild(bubble: BubbleTemp): void {
//     if (this._ischildBubble(bubble) && (bubble.type === BubbleType.internalBubble)) {
//       const newChildren = (bubble as InternalBubbleTemp).childBubbles;
//       const location = bubble.location;
//       this.deleteChild(bubble);
//       this.insertChildren(location, ...newChildren);
//     } else if (bubble.type === BubbleType.leafBubble) {
//       throw new Error(`can't pop leaf bubble`);
//     } else {
//       const errorMsg = `bubble(id: ${bubble.id}) is not child of bubble(id: ${this.id})`;
//       throw new Error(errorMsg);
//     }
//   }

//   private _ischildBubble(bubble: BubbleTemp): boolean {
//     if (bubble.parentBubble === null) {
//       return false;
//     } else {
//       return bubble.parentBubble.id === this.id;
//     }
//   }

//   private _sortByLocation(bubbleList: Array<BubbleTemp>) {
//     bubbleList.sort(function(a: BubbleTemp, b: BubbleTemp) {
//       return a.location - b.location;
//     });
//   }
// } /* istanbul ignore next */

// export class SuggestBubbleTemp {
//   id: number;
//   type: BubbleType;
//   content: string;
//   comments: Array<Comment>;
//   thumbUps: number;

//   constructor(
//     id: number,
//     content: string,
//     comments: Array<Comment>,
//     thumbUps: number = 0
//   ) {
//     // must initialize all attributes
//     this.type = BubbleType.suggestBubble;
//     this.id = id;
//     this.content = content;
//     this.comments = comments;
//     this.thumbUps = thumbUps;
//   }

//   addComment(comment: Comment) {
//     this.comments.push(comment);
//   }

//   deleteComment(comment: Comment) {
//     let index: number = this.comments.indexOf(comment);
//     if (index > -1) {
//       this.comments.splice(index, 1);
//     }
//   }
// } /* istanbul ignore next */
