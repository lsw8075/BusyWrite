import { Bubble, LeafBubble, SuggestBubble, InternalBubble } from './bubble';
import { User } from '../../user/models/user';

export namespace BubbleJsonHelper {
    export function  getBubbleObject(jsonString: string): Bubble {
        const jsonObject = JSON.parse(jsonString);
        if (jsonObject.child_bubbles.length > 0) {
            const childBubbleIds = jsonObject.child_bubbles;
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
        }
        return bubbleList;
    }

    export function getSuggestBubbleObject(jsonString: string): SuggestBubble {
        const jsonObject = JSON.parse(jsonString);
        const suggestBubble = new SuggestBubble(jsonObject.id, jsonObject.content);
        suggestBubble.thumbUps = jsonObject.voters.length;
        return suggestBubble;
    }
    export function getSuggestBubbleArrayObject(jsonString: string): Array<SuggestBubble> {
        const jsonObjectArray = JSON.parse(jsonString);
        const suggestBubbleList: Array<SuggestBubble> = [];
        for (const jsonObject of jsonObjectArray) {
            suggestBubbleList.push(this.getSuggestBubbleObject(JSON.stringify(jsonObject)));
        }
        return suggestBubbleList;
    }

    export function getUserObject(jsonString: string): User {
        const jsonObject = JSON.parse(jsonString);
        const user = new User(jsonObject.id, jsonObject.email);
        return user;
    }
    export function getUserArrayObject(jsonString: string): Array<User> {
        const jsonObjectArray = JSON.parse(jsonString);
        const userList: Array<User> = [];
        for (const jsonObject of jsonObjectArray) {
            userList.push(this.getUserObject(JSON.stringify(jsonObject)));
        }
        return userList;
    }
}
