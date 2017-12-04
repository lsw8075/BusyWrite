import { Bubble, LeafBubble, InternalBubble } from './bubble';

export class BubbleJsonHelper {
    constructor() {
    }

    getBubbleObject(jsonString: string): Bubble {
        const jsonObject = JSON.parse(jsonString);
        if (jsonObject.child_bubble) {
            let childBubbleIds = jsonObject.child_bubble;
            let internalBubble = new InternalBubble(jsonObject.id, childBubbleIds);
            internalBubble.parentBubbleId = jsonObject.parent_bubble_id;
            internalBubble.location = jsonObject.location;
            return internalBubble;
        } else {
            let leafBubble = new LeafBubble(jsonObject.id, jsonObject.content);
            leafBubble.parentBubbleId = jsonObject.parent_bubble_id;
            leafBubble.location = jsonObject.location;
            return leafBubble;
        }
    }
    getBubbleArrayObject(jsonString: string): Array<Bubble> {
        const jsonObjectArray = JSON.parse(jsonString);
        let bubbleList: Array<Bubble> = [];

        for (const jsonObject of jsonObjectArray) {
            bubbleList.push(this.getBubbleObject(JSON.stringify(jsonObject)));
            // TODO: construct parent_id - max(location for the parent_id) table
        }

        // TODO: iterate again to calculate child_bubbles list
        return bubbleList;
    }
}
