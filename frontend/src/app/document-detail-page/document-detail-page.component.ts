import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../service/authentication.service';
import { AlarmService } from '../service/alarm.service';
import { BoardService } from '../service/board.service';
import { BubbleService } from '../service/bubble.service';
import { CommentService } from '../service/comment.service';
import { DirectoryService } from '../service/directory.service';
import { DocumentService } from '../service/document.service';
import { NoteService } from '../service/note.service';

import { Alarm } from '../model/alarm';
import { Board } from '../model/board';
import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../model/bubble';
import { Comment } from '../model/comment';
import { FileSystemEntity } from '../model/file-system-entity';
import { Note } from '../model/note';

@Component({
  selector: 'app-document-detail-page',
  templateUrl: './document-detail-page.component.html',
  styleUrls: ['./document-detail-page.component.css']
})
export class DocumentDetailPageComponent {

  constructor() { }


} /* istanbul ignore next */

export { AuthenticationService, BoardService, BubbleService, AlarmService, CommentService, DirectoryService, DocumentService, NoteService};
export { Alarm, Board, BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble, Comment, FileSystemEntity, Note };
