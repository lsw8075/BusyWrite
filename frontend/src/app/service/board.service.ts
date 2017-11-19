import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Board } from '../model/board';

@Injectable()
export class BoardService {

  private previewUpdateEventSource = new Subject<void>();
  previewUpdateEvent$ = this.previewUpdateEventSource.asObservable();

  updatePreview() {
    this.previewUpdateEventSource.next();
  }
}
