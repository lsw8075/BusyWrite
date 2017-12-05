import { Bubble, LeafBubble, InternalBubble } from './bubble';

export namespace BubbleJsonHelper {
    export function  getBubbleObject(jsonString: string): Bubble {
        const jsonObject = JSON.parse(jsonString);
        if (jsonObject.child_bubble) {
            const childBubbleIds = jsonObject.child_bubble;
            const internalBubble = new InternalBubble(jsonObject.id, childBubbleIds);
            internalBubble.parentBubbleId = jsonObject.parent_bubble_id;
            internalBubble.location = jsonObject.location;
            return internalBubble;
        } else {
            const leafBubble = new LeafBubble(jsonObject.id, jsonObject.content);
            leafBubble.parentBubbleId = jsonObject.parent_bubble_id;
            leafBubble.location = jsonObject.location;
            return leafBubble;
        }
    }
    export function getBubbleArrayObject(jsonString: string): Array<Bubble> {
        const jsonObjectArray = JSON.parse(jsonString);
        const bubbleList: Array<Bubble> = [];

        for (const jsonObject of jsonObjectArray) {
            bubbleList.push(this.getBubbleObject(JSON.stringify(jsonObject)));
            // TODO: construct parent_id - max(location for the parent_id) table
        }

        // TODO: iterate again to calculate child_bubbles list
        return bubbleList;
    }
}
