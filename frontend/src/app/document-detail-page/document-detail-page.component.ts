import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { BoardService } from '../service/board.service';
import { BubbleService } from '../service/bubble.service';
import { CommentService } from '../service/comment.service';
import { DirectoryService } from '../service/directory.service';
import { DocumentService } from '../service/document.service';
import { NoteService } from '../service/note.service';

import { Alert } from '../model/alert';
import { Board } from '../model/board';
import { BubbleType, Bubble, SuggestBubble } from '../model/bubble';
import { Comment } from '../model/comment';
import { FileSystemEntity } from '../model/file-system-entity';
import { Note } from '../model/note';

@Component({
  selector: 'app-document-detail-page',
  templateUrl: './document-detail-page.component.html',
  styleUrls: ['./document-detail-page.component.css']
})

export class DocumentDetailPageComponent implements OnInit {

  documentTitle = '';
  shouldShowTitleError = false;
  displayTitleEditDialog = false;

  constructor(
    private _documentService: DocumentService
  ) {}

  ngOnInit() {
    this._documentService.getTitle().then(
      title => this.documentTitle = title
    );
  }

  onChangeTitleButton() {
    if (/\S+/.test(this.documentTitle)) {
      this.shouldShowTitleError = false;
      this.displayTitleEditDialog = false;
      this._documentService.setTitle(this.documentTitle);
    } else {
      this.shouldShowTitleError = true;
      this._documentService.getTitle().then(
        title => this.documentTitle = title
      );
    }
  }

  onCancelTitleButton() {
    this.displayTitleEditDialog = false;
    this.shouldShowTitleError = false;
    this._documentService.getTitle().then(
      title => this.documentTitle = title
    );
  }
} /* istanbul ignore next */

export { AuthenticationService, BoardService, BubbleService, AlertService, CommentService, DirectoryService, DocumentService, NoteService};
export { Alert, Board, BubbleType, Bubble, SuggestBubble, Comment, FileSystemEntity, Note };
