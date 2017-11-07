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

export class DocumentDetailPageComponent implements OnInit {

  documentTitle: string = ""; 
  shouldShowTitleError: boolean = false;
  displayTitleEditDialog: boolean = false;

  constructor(
    private _documentService: DocumentService
  ) {}

  ngOnInit() {
    
    this._documentService.getTitle().then(
      title => this.documentTitle = title
    );  
  }
  
  onChangeTitleButton() {

    if(this.documentTitle) {

      this.shouldShowTitleError = false;
      this.displayTitleEditDialog = false;

      // set the title
      this._documentService.setTitle(this.documentTitle);

    } else {
      this.shouldShowTitleError = true;

      // recover the title
      this._documentService.getTitle().then(
        title => this.documentTitle = title
      );
    }
  }

  onCancelTitleButton() {
  
    this.displayTitleEditDialog = false;
    this.shouldShowTitleError = false;

    // recover the title
    this._documentService.getTitle().then(
      title => this.documentTitle = title
    );
  }
} /* istanbul ignore next */


export { AuthenticationService, BoardService, BubbleService, AlarmService, CommentService, DirectoryService, DocumentService, NoteService};
export { Alarm, Board, BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble, Comment, FileSystemEntity, Note };
