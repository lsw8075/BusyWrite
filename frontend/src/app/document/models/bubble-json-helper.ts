import { Bubble, LeafBubble, SuggestBubble, InternalBubble, BubbleType } from './bubble';
import { User } from '../../user/models/user';
import { Comment } from './comment';
import { Note } from './note';
import { Document } from '../../file/models/document';

export namespace BubbleJsonHelper {
    export function getDocumentObject(jsonString: string): Document {
        const jsonObject = JSON.parse(jsonString);
        const contributors = this.getUserArrayObject(JSON.stringify(jsonObject.contributors));
        const doc = new Document(jsonObject.document_id, jsonObject.title, contributors);
        return doc;
    }

    export function getBubbleObject(jsonString: string): Bubble {
        const jsonObject = JSON.parse(jsonString);
        if (jsonObject.child_bubbles.length > 0) {
            const childBubbleIds = jsonObject.child_bubbles;
            const internalBubble = new InternalBubble(jsonObject.id, childBubbleIds);
            internalBubble.type = BubbleType.internalBubble;
            internalBubble.parentBubbleId = jsonObject.parent_bubble;
            internalBubble.location = jsonObject.location;
            return internalBubble;
        } else {
            const leafBubble = new LeafBubble(jsonObject.id, jsonObject.content);
            leafBubble.type = BubbleType.leafBubble;
            leafBubble.parentBubbleId = jsonObject.parent_bubble;
            leafBubble.location = jsonObject.location;
            leafBubble.editLockHoder = jsonObject.edit_lock_holder;
            return leafBubble;
        }
    }
    export function getBubbleArrayObject(jsonString: string): Array<Bubble> {
        const jsonObjectArray = JSON.parse(jsonString);
        const bubbleList: Array<Bubble> = [];
        let rootBubbleLocation = 0;

        for (let i = 0; i < jsonObjectArray.length; i++) {
            const jsonObject = jsonObjectArray[i];
            const bubble = this.getBubbleObject(JSON.stringify(jsonObject));
            bubbleList.push(bubble);
            if (! bubble.parentBubbleId) {
                rootBubbleLocation = i;
            }
        }
        const rootBubble = bubbleList.splice(rootBubbleLocation, 1);
        bubbleList.splice(0, 0, rootBubble[0]);
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
        const user = new User(jsonObject.id, jsonObject.username, jsonObject.email);
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

    export function getCommentObject(jsonString: string): Comment {
        const jsonObject = JSON.parse(jsonString);
        const comment = new Comment(jsonObject.id, jsonObject.content, jsonObject.owner);
        return comment;
    }
    export function getCommentArrayObject(jsonString: string): Array<Comment> {
        const jsonObjectArray = JSON.parse(jsonString);
        const commentList: Array<Comment> = [];
        for (const jsonObject in jsonObjectArray) {
            commentList.push(this.getCommentObject(JSON.stringify(jsonObject)));
        }
        return commentList;
    }

    export function getNoteObject(jsonString: string): Note {
        const jsonObject = JSON.parse(jsonString);
        const note = new Note(jsonObject.id, jsonObject.document_id,
                jsonObject.owner_id, jsonObject.content);
        return note;
    }
    export function getNoteArrayObject(jsonString: string): Array<Note> {
        const jsonObjectArray = JSON.parse(jsonString);
        const noteList: Array<Note> = [];
        for (const jsonObject in jsonObjectArray) {
            noteList.push(this.getNoteObject(JSON.stringify(jsonObject)));
        }
        return noteList;
    }

}
