import { Injectable } from '@angular/core';
import { Bubble, BubbleType, LeafBubble, InternalBubble, SuggestBubble } from '../models/bubble';
import { MockBubbleRoot, MockBubbleList } from '../models/bubble.mock';

import 'rxjs/add/operator/toPromise';
import { MenuType } from './event/event-bubble.service';

let tempId = 30; // to be deleted after backend implemented
const tempUserId = 1;
@Injectable()
export class BubbleService {

  bubbleList: Array<Bubble> = [];
  bubbleRoot: InternalBubble;

  constructor()  {
    this._getBubbleList().then(bubbleList => {
        this.bubbleList = bubbleList;
      });
  }

  public getRootBubble(): Promise<Bubble> {
    return Promise.resolve(this.bubbleRoot);
  }

  public getBubbleList(): Promise<Array<Bubble>> {
    return Promise.resolve(this.bubbleList);
  }

  public getBubbleById(id: number): Bubble {
    if (0 < id) {
      for (const bubble of this.bubbleList) {
        if (bubble.id === id) {
          return bubble;
        }
      }
    }
    throw new Error('bubble with index ' + id + ' does not exist');
  }

  public createBubble(parentBubble: InternalBubble, location: number, content: string): Promise<Bubble> {
    const newBubble = new LeafBubble(this._getId(), content, tempUserId);
    parentBubble.insertChildren(location, newBubble);
    return Promise.resolve(newBubble);
  }


  public editBubble(bubble: Bubble, newContent: string): Promise<void> {
    if (bubble.type === BubbleType.leafBubble) {
      (bubble as LeafBubble).getEditLock(tempUserId);
      (bubble as LeafBubble).content = newContent;
      return Promise.resolve(null);
    } else {
      throw new Error('Cannot edit internal bubble');
    }
  }

  public deleteBubble(bubble: Bubble): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot delete root bubble');
    }
    const parentBubble: InternalBubble = bubble.parentBubble;
    parentBubble.deleteChild(bubble);

    const deleteBubbleList = [];
    this._getChildrenList(bubble, deleteBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, deleteBubbleList));

    if (parentBubble.childBubbles.length === 1) {
      const grandParentBubble: InternalBubble = parentBubble.parentBubble;
      grandParentBubble.popChild(parentBubble);
    }

    return Promise.resolve(null);
  }

  public wrapBubble(wrapBubbleList: Array<Bubble>): Promise<void> {
    if (wrapBubbleList.length > 1) {
      const parentBubble: InternalBubble = wrapBubbleList[0].parentBubble;
      const wrapperBubble = new InternalBubble(this._getId(), null);
      parentBubble.wrapChildren(wrapperBubble, wrapBubbleList);
      this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, wrapBubbleList));
      this.bubbleList.push(wrapperBubble);
    }
    return Promise.resolve(null);
  }

  public async popBubble(bubble: Bubble): Promise<void> {
    // check the assumptions
    if (bubble.parentBubble === null) {
      throw new Error('Cannot pop root bubble');
    }

    await this.delay(1000);

    const parentBubble: InternalBubble = bubble.parentBubble;
    parentBubble.popChild(bubble);
    this.bubbleList = this.bubbleList.filter(b => b.id !== bubble.id);

    return Promise.resolve(null);
  }

  // split Leaf bubble
  public splitLeafBubble(bubble: Bubble, selectContent: string, startIndex: number): Promise<void> {
    const originalContent = bubble.getContent();

    if (originalContent.indexOf(selectContent) === -1) {
      throw new Error(`selected content not found in bubble (id: ${bubble.id})`);
    }
    const endIndex: number = startIndex + selectContent.length;

    const splittedChildren: Array<Bubble> = [];

    if (startIndex !== 0) {
      const prevBubble: LeafBubble = new LeafBubble(this._getId(), originalContent.substring(0, startIndex));
      splittedChildren.push(prevBubble);
    }

    if (selectContent) {
      const currBubble: LeafBubble = new LeafBubble(this._getId(), selectContent);
      splittedChildren.push(currBubble);
    }

    if (endIndex !== originalContent.length - 1) {
      const nextBubble: LeafBubble = new LeafBubble(this._getId(), originalContent.substring(endIndex, originalContent.length));
      splittedChildren.push(nextBubble);
    }

    const wrapBubble = new InternalBubble(this._getId(), splittedChildren);

    const parentBubble: InternalBubble = bubble.parentBubble;
    const location = bubble.location;
    parentBubble.deleteChild(bubble);
    this.bubbleList = this.bubbleList.filter(b => b.id !== bubble.id);
    parentBubble.insertChildren(location, wrapBubble);
    this.bubbleList.push(...splittedChildren);

    return Promise.resolve(null);
  }

  public flattenBubble(bubble: Bubble): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot flatten root bubble');
    }
    const parentBubble: InternalBubble = bubble.parentBubble;
    const flattenedBubble = parentBubble.flattenChild(bubble);
    this.bubbleList.push(flattenedBubble);

    const wrapBubbleList = [];
    this._getChildrenList(bubble, wrapBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, wrapBubbleList));

    return Promise.resolve(null);
  }

  public moveBubble(bubble: Bubble, destBubble: Bubble, menu: MenuType): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot move root bubble');
    } else if (bubble.id !== destBubble.id) {
      const parentBubble: InternalBubble = bubble.parentBubble;
      parentBubble.deleteChild(bubble);

      let location = destBubble.location;
      if (menu === MenuType.borderBottomMenu) {
        location ++;
      }
      destBubble.parentBubble.insertChildren(location, bubble);

    }
    return Promise.resolve(null);
  }

  public switchBubble(bubble: Bubble, suggestBubble: SuggestBubble): Bubble {
    const newSB = new SuggestBubble(this._getId(), bubble.getContent(), bubble.comments, bubble.thumbUps);
    if (bubble.type === BubbleType.leafBubble) {
      let leafBubble = bubble as LeafBubble;

      leafBubble.thumbUps = suggestBubble.thumbUps;
      leafBubble.comments = suggestBubble.comments;
      leafBubble.content = suggestBubble.content;

      leafBubble.deleteSuggestBubble(suggestBubble);
      leafBubble.addSuggestBubble(newSB);

      return leafBubble;
    }
    else if(bubble.type === BubbleType.internalBubble) {
      let internalBubble = bubble as InternalBubble;
      let parentBubble = internalBubble.parentBubble;
      let leafBubble = new LeafBubble(this._getId());

      leafBubble.thumbUps = suggestBubble.thumbUps;
      leafBubble.comments = suggestBubble.comments;
      leafBubble.content = suggestBubble.content;
      leafBubble.suggestBubbles = internalBubble.suggestBubbles;

      leafBubble.deleteSuggestBubble(suggestBubble);
      leafBubble.addSuggestBubble(newSB);

      parentBubble.childBubbles[internalBubble.location] = leafBubble;

      return leafBubble;
    }
  }

  private _getBubbleList(): Promise< Array<Bubble> > {
    this.bubbleRoot = MockBubbleRoot;
    return Promise.resolve(MockBubbleList);
  }

  private _containsBubble(bubble: Bubble, bubbleList: Array<Bubble>): boolean {
    for (const b of this.bubbleList) {
      if (b.id === bubble.id) {
        return true;
      }
    }
    return false;
  }

  private _getChildrenList(bubble: Bubble, childrenList: Array<Bubble>): void {
    bubble.id = -1; // this is check later if a bubble is not properly erased
    childrenList.push(bubble);
    if (bubble.type !== BubbleType.leafBubble) {
      const children = (bubble as InternalBubble).childBubbles;
      for (const child of children) {
        this._getChildrenList(child, childrenList);
      }
    }
  }

  private _getId(): number {
    tempId++;
    return tempId;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
