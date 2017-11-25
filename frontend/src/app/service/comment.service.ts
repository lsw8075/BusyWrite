import { Injectable } from '@angular/core';
import { Comment } from '../model/comment';
@Injectable()
export class CommentService {

  commentId = 10;

  getCommentId() {
    return this.commentId++;
  }

}
