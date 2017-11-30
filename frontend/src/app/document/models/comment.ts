import { User } from '../../user/models/user';

export class Comment {
  id: number;
  content: string;
  user: User;

  constructor(
    id: number,
    content: string,
    user: User
  ) {
    this.id = id;
    this.content = content;
    this.user = user;
  }
}
