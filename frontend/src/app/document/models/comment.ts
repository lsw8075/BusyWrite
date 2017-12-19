import { User } from '../../user/models/user';

export class Comment {
    id: number;
    content: string;
    owner: number;
    bubbleId: number;
    order: number;

    constructor(
        id: number,
        content: string,
        owner: number,
        bubbleId: number,
        order: number
    ) {
        this.id = id;
        this.content = content;
        this.owner = owner;
        this.bubbleId = bubbleId;
        this.order = order;
    }
}
