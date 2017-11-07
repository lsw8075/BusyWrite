import { Injectable } from '@angular/core';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../model/bubble';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BubbleService {

  bubbleData = [
    { id: 0, parent_id: 0, bubble_type: 'internal', children: [ 1, 15 ]},
    { id: 1, parent_id: 0, bubble_type: 'internal', children: [ 7, 2, 3, 4 ] },
    { id: 2, parent_id: 1, bubble_type: 'leaf', content: 'Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui do' },
    { id: 3, parent_id: 1, bubble_type: 'internal', children: [ 5, 6 ] },
    { id: 4, parent_id: 1, bubble_type: 'leaf', content: 'et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.' },
    { id: 5, parent_id: 3, bubble_type: 'leaf', content: 'lorem ipsum, quia dolor sit amet consectetur adipisci velit, sed quia non numquam  eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?'},
    { id: 6, parent_id: 3, bubble_type: 'leaf', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum'},
    { id: 7, parent_id: 1, bubble_type: 'internal', children: [ 8, 9, 10 ]},
    { id: 8, parent_id: 7, bubble_type: 'internal', children: [ 11, 12 ]},
    { id: 9, parent_id: 7, bubble_type: 'leaf', content: 'xxdsds'},
    { id: 10, parent_id: 7, bubble_type: 'leaf', content: 'yy'},
    { id: 11, parent_id: 8, bubble_type: 'leaf', content: 'zz'},
    { id: 12, parent_id: 8, bubble_type: 'internal', children: [ 13, 14, 16 ]},
    { id: 13, parent_id: 12, bubble_type: 'leaf', content: 'hello swpp team 1'},
    { id: 14, parent_id: 12, bubble_type: 'leaf', content: 'ww'},
    { id: 15, parent_id: 0, bubble_type: 'leaf', content: 'node'},
    { id: 16, parent_id: 12, bubble_type: 'internal', children: [17, 18, 19]},
    { id: 17, parent_id: 16, bubble_type: 'leaf', content: 'hiafaf'},
    { id: 18, parent_id: 16, bubble_type: 'leaf', content: 'hiafaf'},
    { id: 19, parent_id: 16, bubble_type: 'leaf', content: 'hiafaf'}
  ];

  bubbleList: Array<Bubble>;

  // helper function for processing
  private rawBubbleToBubble(rawBubble): Bubble {
    let bubble = null;
    // process raw bubble into Bubble object of each type
    switch (rawBubble.bubble_type) {
      case 'leaf': {
        bubble = new LeafBubble();
        bubble.parentID = rawBubble.parent_id;
        bubble.content = rawBubble.content;
        bubble.location = rawBubble.location;
        bubble.owner = 0; // no owner yet
        bubble.editLock = false; // no editLock yet
        break;
      }
      case 'internal': {
        bubble = new InternalBubble();
        bubble.parentID = rawBubble.parent_id;
        bubble.location = rawBubble.location;
        bubble.childBubbles = rawBubble.children;
        bubble.childBubbleList = [];
        bubble.editLock = false;
        break;
      }
    }
    // process common information among bubbles
    bubble.id = rawBubble.id;
    return bubble;
  }

  constructor()  {
    this.bubbleList = [];
    for (let rawBubble of this.bubbleData) {
      this.bubbleList.push(this.rawBubbleToBubble(rawBubble));
    }

    for (let bubble of this.bubbleList) {
      bubble.parentBubble = this.fetchBubble(bubble.parentID);

      if (bubble.type === BubbleType.internalBubble) {
        let internalBubble = bubble as InternalBubble;
        for (let childBubbleId of internalBubble.childBubbles) {
          internalBubble.childBubbleList.push(this.fetchBubble(childBubbleId));
        }
      }
    }
  }

  calcBubbleHeight(bubble: Bubble): number {
    if (bubble.type === BubbleType.leafBubble) {
      return 1;
    }

    let height = 0;
    let internalBubble = bubble as InternalBubble;
    for (let childBubble of internalBubble.childBubbleList) {
      height = Math.max(height, this.calcBubbleHeight(childBubble));
    }
    return height + 1;
  }

  async fetchBubbles() {
    return this.bubbleList;
  }

  fetchBubble(id: number) {
    if (0 <= id && id < this.bubbleList.length && this.bubbleList[id] != null) {
      return (this.bubbleList[id]);
    } else {
      throw new Error('bubble with index ' + id + ' does not exist');
    }
  }

  async getBubbleById(id: number) {
    return await this.fetchBubble(id);
  }

  adjustChildLocation(childList, firstLocation, adjust, endLocation = -1) {
    if (endLocation === -1) {
      endLocation = childList.length; // the default
    }
    for (let i = firstLocation; i < endLocation; i++) {
      this.bubbleList[childList[i]].location += adjust;
    }
  }

  async createBubble(parentID: number, location: number, content: string) {
    const parentBubble = this.bubbleList[parentID] as InternalBubble;
    if (!parentBubble) {
      throw new Error('invaild parentId in createBubble: ' + parentID);
    }

    // check parent bubble's type
    if (parentBubble.type === BubbleType.internalBubble) {
      const numChild = parentBubble.childBubbles.length;
      if (0 <= location && location <= numChild) {
        // create a new leaf bubble
        const newBubble = new LeafBubble();
        newBubble.id = this.bubbleList.length;
        newBubble.content = content;
        newBubble.location = location;
        newBubble.owner = 0; // not used in sp2. get it from authservice..
        newBubble.editLock = false;
        newBubble.parentID = parentID;
        this.bubbleList.push(newBubble);
        // and insert into children
        parentBubble.childBubbles.splice(location, 0, newBubble.id);
        this.adjustChildLocation(parentBubble.childBubbles, location + 1, +1);
        return (newBubble);
      } else {
        throw new Error('invaild location in createBubble: ' + location);
      }
    }
  }

  cascadedDeleteHelper(deleteID: number) {

    const deletingBubble = this.bubbleList[deleteID];

    switch(deletingBubble.type) {
      case BubbleType.internalBubble:
        // delete each child
        for(let childID of (deletingBubble as InternalBubble).childBubbles) {
          this.cascadedDeleteHelper(childID);
        }
        // TODO : delete any suggest bubbles
        break;
      case BubbleType.leafBubble:
        // TODO : delete any suggest bubbles
        break;
        //case BubbleType.suggestBubble:
    }
    // delete itself
    this.bubbleList[deleteID] = null;
  }


  async deleteBubble(deleteID: number) {
    let deletee = this.bubbleList[deleteID];
    // find bubble at parents' childList
    let childList = (this.bubbleList[deletee.parentID] as InternalBubble).childBubbles;
    let childIndex = childList.indexOf(deleteID);
    if (childIndex === -1) {
      throw new Error('Cannot find child ' + deleteID + ' in deleteBubble');
    }

    // delete bubble from childList
    childList.splice(childIndex, 1);
    this.adjustChildLocation(childList, childIndex, -1);
    
    // cascaded delete
    this.cascadedDeleteHelper(deleteID);
  }

  async wrapBubble(wrapList: Array<number>) {

    if (wrapList.length < 1) 
      throw new Error('Wrapee does not exist');
  }
}

