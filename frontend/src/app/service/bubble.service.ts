import { Injectable } from '@angular/core';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../model/bubble';
import { MockBubbleRoot, MockBubbleList } from '../model/bubble.mock';

import 'rxjs/add/operator/toPromise';

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
    const tempId = 100; // to be deleted after backend implemented
    const newBubble = new LeafBubble(tempId, content);
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

    bubble.id = -1; // this is check later if a bubble is not properly erased
    this.bubbleList = this.bubbleList.filter(b => b.id !== bubble.id);
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
  async splitLeafBubble(splitID, prevContent, splitContent, nextContent) {
    const splitee = this.bubbleList[splitID] as LeafBubble;

    // change LeafBubble to the InternalBubble
    const newInternal = new InternalBubble(0, null);
    newInternal.id = splitee.id;
    newInternal.location = splitee.location;
    newInternal.comments = splitee.comments;
    newInternal.parentBubble = splitee.parentBubble;
    newInternal.suggestBubbles = splitee.suggestBubbles;
    newInternal.childBubbles = [];

    // alter bubble to newInternal
    this.bubbleList[splitID] = newInternal;

    // split splitee to 2 or 3 child of new InternalBubble
    if (!prevContent && nextContent) {
      this.createBubble(splitID, 0, splitContent);
      this.createBubble(splitID, 1, nextContent);
    } else if (prevContent && !nextContent) {
      this.createBubble(splitID, 0, prevContent);
      this.createBubble(splitID, 1, splitContent);
    } else if (prevContent && nextContent) {
      this.createBubble(splitID, 0, prevContent);
      this.createBubble(splitID, 1, splitContent);
      this.createBubble(splitID, 2, nextContent);
    } else {
      throw new Error('invalid split');
    }
    return newInternal;
  }

  public flattenBubble(bubble: Bubble): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot flatten root bubble');
    }
    const parentBubble: InternalBubble = bubble.parentBubble;
    const flattenedBubble = parentBubble.flattenChild(bubble);
    this.bubbleList = this.bubbleList.filter(b => b.id !== bubble.id);
    this.bubbleList.push(flattenedBubble);
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

}

