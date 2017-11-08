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
        bubble.content = rawBubble.content;
        bubble.owner = 0; // no owner yet
        bubble.editLock = false; // no editLock yet
        break;
      }
      case 'internal': {
        bubble = new InternalBubble();
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

    this.bubbleList[0].parentID = -1;
    this.bubbleList[0].parentBubble = null;

    for (let bubble of this.bubbleList) {
      if(bubble.type == BubbleType.internalBubble) {

        const parentBubble = bubble as InternalBubble;
        const childrenID = parentBubble.childBubbles;

        // for each child, set parentID and location
        for (let i = 0; i < childrenID.length; i++) {

          let childBubble = this.bubbleList[childrenID[i]];

          childBubble.parentBubble = bubble;
          childBubble.parentID = bubble.id;
          childBubble.location = i;

          parentBubble.childBubbleList.push(childBubble);
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
        newBubble.parentBubble = this.bubbleList[parentID];
        this.bubbleList.push(newBubble);

        // and insert into children
        parentBubble.childBubbles.splice(location, 0, newBubble.id);
        parentBubble.childBubbleList.splice(location, 0, newBubble);

        this.adjustChildLocation(parentBubble.childBubbles, location + 1, +1);
        return (newBubble);
      } else {
        throw new Error('invaild location in createBubble: ' + location);
      }
    }
  }

  async editBubble(editID: number, content: string) {
    let editee = this.bubbleList[editID] as LeafBubble;
    editee.content = content;
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
    let childBubbleList = (this.bubbleList[deletee.parentID] as InternalBubble).childBubbleList;
    let childIndex = childList.indexOf(deleteID);
    if (childIndex === -1) {
      throw new Error('Cannot find child ' + deleteID + ' in deleteBubble');
    }

    // delete bubble from childList
    childList.splice(childIndex, 1);
    childBubbleList.splice(childIndex, 1);

    this.adjustChildLocation(childList, childIndex, -1);
    
    // cascaded delete
    this.cascadedDeleteHelper(deleteID);
  }

  async wrapBubble(wrapList: Array<number>) {

    if (wrapList.length < 1) {
      throw new Error('Wrapee does not exist');
    }

    let firstWrapee = this.bubbleList[wrapList[0]] as LeafBubble | InternalBubble;
    let commonParent = this.bubbleList[firstWrapee.parentID] as InternalBubble;

    // check the assumptions
    for (let wrapee of wrapList) {

      let curBubble = this.bubbleList[wrapee] as LeafBubble | InternalBubble;

        if (curBubble.parentID !== commonParent.id) {
          throw new Error('Wrapee does not have common parent');
        }
  
    }
    
    // check the adjacent condition
    let firstLocation = -1;

    let wrapeeSet = wrapList;
    const wrapeeString = wrapeeSet.sort().toString();

    for (let index = 0 ; index <= commonParent.childBubbles.length - wrapeeSet.length ; index++) {
      // if wrappee set is adjacently in the child bubbles
      const adjacentString = commonParent.childBubbles.slice(index, index + wrapeeSet.length).sort().toString();
      if (adjacentString == wrapeeString) {
        firstLocation = index;
      }
    }

    // wrappee set is maybe not adjacent
    if (firstLocation == -1) {
      throw new Error('Wrapees are not adjacent : ' + wrapeeString);
    }

    // create new Parent
    let newParent = new InternalBubble();
    newParent.id = this.bubbleList.length;
    newParent.location = firstLocation
    newParent.editLock = false;
    newParent.parentID = commonParent.id;
    newParent.parentBubble = commonParent;
    newParent.childBubbles = commonParent.childBubbles.slice(firstLocation, firstLocation + wrapList.length);
    newParent.childBubbleList = [];

    for (let index = 0; index < wrapList.length; index++) {
      const childID = newParent.childBubbles[index];
      newParent.childBubbleList.push(this.bubbleList[childID]);

      let childBubble = this.bubbleList[childID];

      childBubble.location = index;
      childBubble.parentID = newParent.id;
      childBubble.parentBubble = newParent;
    }
    this.bubbleList.push(newParent);

    // and delete bubbles & insert new Parent from childList
    commonParent.childBubbles.splice(firstLocation, wrapList.length, newParent.id);
    commonParent.childBubbleList.splice(firstLocation, wrapList.length, newParent);
    this.adjustChildLocation(commonParent.childBubbles, firstLocation + 1, 1 - wrapList.length);

    return (newParent);

  }

  async popBubble(popID: number) {

    const popee = this.bubbleList[popID] as InternalBubble;

    // check the assumptions
    if (popID === 0) {
      throw new Error('Popee is root bubble');
    }

    const parentBubble = this.bubbleList[popee.parentID] as InternalBubble;

    // set new parent
    for (let child of popee.childBubbles) {
      (this.bubbleList[child] as LeafBubble | InternalBubble).parentID = parentBubble.id;
      (this.bubbleList[child] as LeafBubble | InternalBubble).parentBubble = parentBubble;
    }

    const childLength = popee.childBubbles.length;

    // 'pop' the bubble
    parentBubble.childBubbles.splice(popee.location, 1, ...popee.childBubbles);
    parentBubble.childBubbleList.splice(popee.location, 1, ...popee.childBubbleList);

    // adjust location of new & old children
    this.adjustChildLocation(parentBubble.childBubbles, popee.location, popee.location,
      popee.location + childLength);
    this.adjustChildLocation(parentBubble.childBubbles, popee.location + childLength, childLength - 1);

    // delete the popee

    this.bubbleList[popID] = null;

    return (parentBubble);
  }
  
  // split Leaf bubble
  async splitLeafBubble(splitID, prevContent, splitContent, nextContent) {
    const splitee = this.bubbleList[splitID] as LeafBubble;
    
    // change LeafBubble to the InternalBubble
    let newInternal = new InternalBubble();
    newInternal.id = splitee.id;
    newInternal.location = splitee.location;
    newInternal.comments = splitee.comments;
    newInternal.parentID = splitee.parentID;
    newInternal.parentBubble = splitee.parentBubble;
    newInternal.suggestBubbles = splitee.suggestBubbles;
    newInternal.childBubbles = [];
    newInternal.childBubbleList = [];

    // alter bubble to newInternal
    this.bubbleList[splitID] = newInternal;

    // split splitee to 2 or 3 child of new InternalBubble
    if (!prevContent && nextContent) {
      this.createBubble(splitID, 0, splitContent);
      this.createBubble(splitID, 1, nextContent);
    } else if(prevContent && !nextContent) {
      this.createBubble(splitID, 0, prevContent);
      this.createBubble(splitID, 1, splitContent);
    } else if(prevContent && nextContent) {
      this.createBubble(splitID, 0, prevContent);
      this.createBubble(splitID, 1, splitContent);
      this.createBubble(splitID, 2, nextContent);
    } else {
      throw new Error('invalid split');
    }
    return newInternal;
  }

  async flattenBubble(flattenID: number) {
    const flattenee = this.bubbleList[flattenID];
    return (flattenee);
  }
}

