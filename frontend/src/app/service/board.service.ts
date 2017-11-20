import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Board, EditItem } from '../model/board';
import { Bubble } from '../model/bubble';
import { BubbleService } from './bubble.service';


@Injectable()
export class BoardService {

  tempId = 1;

  private previewUpdateEventSource = new Subject<void>();
  private createBubbleEventSource = new Subject<EditItem>();
  private finishBubbleEditEventSource = new Subject<Bubble>();

  previewUpdateEvent$ = this.previewUpdateEventSource.asObservable();
  createBubbleEvent$ = this.createBubbleEventSource.asObservable();
  finishBubbleEditEvent$ = this.finishBubbleEditEventSource.asObservable();

  constructor(private _bubbleService: BubbleService) {}

  updatePreview() {
    this.previewUpdateEventSource.next();
  }

  createBubble(bubble: Bubble) {
    const newEditItem: EditItem = new EditItem(this.getId(), bubble);
    this.createBubbleEventSource.next(newEditItem);
  }

  public finishEdit(bubble: Bubble, content: string) {
    this._bubbleService.editBubble(bubble, content).then(() => {
      this.finishBubbleEditEventSource.next(bubble);
    });
  }

  private getId(): number {
    this.tempId ++;
    return this.tempId;
  }

}
