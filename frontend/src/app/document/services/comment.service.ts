import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';
@Injectable()
export class CommentService {

  commentId = 10;

  getCommentId() {
    return this.commentId++;
  }

}
