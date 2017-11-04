import { Injectable } from '@angular/core';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../model/bubble';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BubbleService {

    bubbleData = [
        { id: 0, parent_id: 0, bubble_type: 'leaf', content: 'dummy bubble'},
        { id: 1, parent_id: 0, bubble_type: 'internal', children: [ 2, 3, 4 ] },
        { id: 2, parent_id: 1, bubble_type: 'leaf', content: 'Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui do' },
        { id: 3, parent_id: 1, bubble_type: 'internal', children: [ 5, 6 ] },
        { id: 4, parent_id: 1, bubble_type: 'leaf', content: 'et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.' },
        { id: 5, parent_id: 3, bubble_type: 'leaf', content: 'lorem ipsum, quia dolor sit amet consectetur adipisci velit, sed quia non numquam  eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?'},
        { id: 6, parent_id: 3, bubble_type: 'leaf', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum'}
    ];

    bubbleList: Array<Bubble>;
    
    // helper function for processing    
    rawBubbleToBubble(rawBubble) : Bubble { 
        let bubble = null;
        // process raw bubble into Bubble object of each type
        switch(rawBubble.bubble_type) {
        case 'leaf':
            bubble = new LeafBubble();
            bubble.parentID = rawBubble.parent_id;
            bubble.content = rawBubble.content;
            bubble.location = rawBubble.location;
            bubble.owner = 0; // no owner yet
            bubble.editLock = false; // no editLock yet
            break;
        case 'internal':
            bubble = new InternalBubble();
            bubble.parentID = rawBubble.parent_id;
            bubble.location = rawBubble.location;
            bubble.childBubbles = rawBubble.children;
            bubble.editLock = false;
            break;
        default:
            throw new Error('unknown type of bubble');
        }
        // process common information among bubbles
        bubble.id = rawBubble.id;
        return bubble;
    }


    constructor()  {
        for(let rawBubble of this.bubbleData) {
            this.bubbleList[rawBubble.id] = this.rawBubbleToBubble(rawBubble);
        }
    }

    async fetchBubbles() {
        return this.bubbleList;
    }

    async fetchBubble(id: number) {
            if(1 <= id && id < this.bubbleList.length && this.bubbleList[id] != null) {
                return (this.bubbleList[id]);
            } else {
                throw new Error('bubble with index ' + id + ' does not exist');
        }
    }
    
    async getBubbleById(id: number) {
        return await this.fetchBubble(id);
    }

    adjustChildLocation(childList, firstLocation, adjust, endLocation=-1) {
        if(endLocation == -1) {
            endLocation = childList.length; // the default
        }
        for(let i=firstLocation; i<endLocation; i++) {
            this.bubbleList[childList[i]].location += adjust;
        }
    }

    async createBubble(parentID: number, location: number, content: string) {
        
        let parentBubble = this.bubbleList[parentID] as InternalBubble;
        if(!parentBubble) {
            throw new Error('invaild parentId in createBubble: ' + parentID);
        }
        
        // check parent bubble's type
        if(parentBubble.type == BubbleType.internalBubble) {
            let numChild = parentBubble.childBubbles.length;
            if(0 <= location && location <= numChild) {
                // create a new leaf bubble
                let newBubble = new LeafBubble();
                newBubble.id = this.bubbleList.length;
                newBubble.content = content;
                newBubble.location = location;
                newBubble.owner = 0; // not used in sp2. get it from authservice..
                newBubble.editLock = false;
                newBubble.parentID = parentID;
                this.bubbleList.push(newBubble);
                // and insert into children
                parentBubble.childBubbles.splice(location, 0, newBubble.id);
                this.adjustChildLocation(parentBubble.childBubbles, location+1, +1);
                return (newBubble);
            } else {
                throw new Error('invaild location in createBubble: ' + location)
            }
        }
    }

    async deleteBubble(deleteID: number) {
        
        if(deleteID == 1) {
            throw new Error('Cannot delete root bubble');
        }
        let bubble = this.bubbleList[deleteID] as LeafBubble | InternalBubble;
        
        // TODO : cascaded delete..
        
        // find bubble at parents' childList
        let childList = (this.bubbleList[bubble.parentID] as InternalBubble).childBubbles;
        let childIndex = childList.indexOf(deleteID);
        if(childIndex == -1) {
            throw new Error('Cannot find child ' + deleteID + ' in deleteBubble');
        }
        
        // delete bubble from childList
        childList.splice(childIndex, 1);
        this.adjustChildLocation(childList, childIndex, -1);
        this.bubbleList[deleteID] = null;
    }

    async wrapBubble(wrapList: Array<number>) {
        
        if(wrapList.length < 1) {
            throw new Error('Wrapee does not exist')
        }
        
        let firstWrapee = this.bubbleList[wrapList[0]] as LeafBubble | InternalBubble;
        let commonParent = this.bubbleList[firstWrapee.parentID] as InternalBubble;
        
        // check the assumptions
        let curLocation = firstWrapee.location;
        
        for(let wrapee of wrapList) {

            let curBubble = this.bubbleList[wrapee] as LeafBubble | InternalBubble;
            
            // check the assumptions
            if(curBubble.parentID != commonParent.id) {
                throw new Error('Wrapee does not have common parent');
            }
            if(commonParent.childBubbles[curLocation] != curBubble.id) {
                throw new Error('Wrapee does not adjacent');
            }
            curLocation++;
        }

        let firstLocation = firstWrapee.location;

        // create new Parent
        let newParent = new InternalBubble();
        newParent.id = this.bubbleList.length;
        newParent.location = firstLocation;
        newParent.editLock = false;
        newParent.parentID = commonParent.id;
        newParent.childBubbles = wrapList;
        this.bubbleList.push(newParent);

        // and delete bubbles & insert new Parent from childList
        commonParent.childBubbles.splice(firstLocation, wrapList.length, newParent.id);
        this.adjustChildLocation(commonParent.childBubbles, firstLocation+1, wrapList.length - 1);

        return (newParent);

    }

    async popBubble(popID: number) {
    
        let popee = this.bubbleList[popID] as InternalBubble;
        
        // check the assumptions
        if(popID == 1) {
            throw new Error('Popee is root bubble');
        }
        
        let parentBubble = this.bubbleList[popee.parentID] as InternalBubble;
        
        // set new parent
        for(let child of popee.childBubbles) {
            (this.bubbleList[child] as LeafBubble | InternalBubble).parentID = parentBubble.id;
        }
        
        let childLength = popee.childBubbles.length;

        // 'pop' the bubble
        parentBubble.childBubbles.splice(popee.location, 1, ...popee.childBubbles);

        // adjust location of new & old children
        this.adjustChildLocation(parentBubble.childBubbles, popee.location, popee.location,
            popee.location + childLength);
        this.adjustChildLocation(parentBubble.childBubbles, popee.location + childLength, childLength - 1);

        // delete the popee

        this.bubbleList[popID] = null;
        
        return (parentBubble);
    }

    async splitBubble(splitID, prevContent, splitContent, nextContent) {
        
        let splitee = this.bubbleList[splitID];

        return (splitee);
    }
    
    flatten_recursive_helper() {
    }

    async flattenBubble(flattenID: number) {

        let flattenee = this.bubbleList[flattenID];
        return (flattenee);

    }
}
