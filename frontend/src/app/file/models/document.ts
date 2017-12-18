import { User } from '../../user/models/user';

export class Document {
    id: number;
    title: string;
    contributors: Array<User> = [];
    
    constructor(
        id: number,
        title: string,
        contributors: Array<User> = []) {
        this.id = id;
        this.title = title;
        this.contributors = contributors;
    }
}

