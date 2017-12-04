import { Bubble, LeafBubble, InternalBubble } from './bubble';

export class BubbleJsonHelper {
    constructor() {
    }

    getBubbleObject(jsonString: string): Bubble {
        const jsonObject = JSON.parse(jsonString);
        if (jsonObject.child_bubble) {
            let childBubbleIds = jsonObject.child_bubble;
            let internalBubble = new InternalBubble(jsonObject.id, childBubbleIds);
            internalBubble.parentBubbleId = jsonObject.parentBubbleId;
            return internalBubble;
        } else {
            let leafBubble = new LeafBubble(jsonObject.id, jsonObject.content);
            leafBubble.parentBubbleId = jsonObject.parentBubbleId;
            return leafBubble;
        }
    }
    getBubbleArrayObject(jsonString: string): Array<Bubble> {
        const jsonObjectArray = JSON.parse(jsonString);
        let bubbleList: Array<Bubble> = [];

        for (const jsonObject of jsonObjectArray) {
            bubbleList.push(this.getBubbleObject(JSON.stringify(jsonObject)));
        }
        return bubbleList;
    }
}
