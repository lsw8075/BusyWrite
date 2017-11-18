import { Injectable } from '@angular/core';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../model/bubble';
import { MockBubbleRoot, MockBubbleList } from '../model/bubble.mock';

import 'rxjs/add/operator/toPromise';

let tempId = 30; // to be deleted after backend implemented

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

  public createBubble(parentBubble: InternalBubble, location: number, content: string): Promise<void> {
    const newBubble = new LeafBubble(this._getId(), content);
    parentBubble.insertChildren(location, newBubble);
    return Promise.resolve(null);
  }

  public editBubble(bubble: LeafBubble, newContent: string): Promise<void> {
    bubble.content = newContent;
    return Promise.resolve(null);
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

    return Promise.resolve(null);
  }

  public wrapBubble(wrapBubbleList: Array<Bubble>): Promise<void> {
    const parentBubble: InternalBubble = wrapBubbleList[0].parentBubble;
    const wrapperBubble = parentBubble.wrapChildren(wrapBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, wrapBubbleList));
    this.bubbleList.push(wrapperBubble);
    return Promise.resolve(null);
  }

  public popBubble(bubble: Bubble): Promise<void> {
    // check the assumptions
    if (bubble.parentBubble === null) {
      throw new Error('Cannot pop root bubble');
    }

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

    const currBubble: LeafBubble = new LeafBubble(this._getId(), selectContent);
    splittedChildren.push(currBubble);

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

}

