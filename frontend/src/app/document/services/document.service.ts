import { Injectable } from '@angular/core';
import { Document } from '../models/document';

@Injectable()
export class DocumentService {

  documentTitle: string;

  constructor() {
    this.documentTitle = 'BusyWrite Demo Document';
  }

  async setTitle(newTitle: string) {
    if (newTitle) {
      if (newTitle.length > 60) {
        return false;
      } else {
        this.documentTitle = newTitle;
      }
    } else {
      throw new Error('Invaild Title');
    }
  }

  async getTitle() {
    return this.documentTitle;
  }

} /* istanbul ignore next */
