import { Component, OnInit } from '@angular/core';
import { DocumentService } from './service';

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
