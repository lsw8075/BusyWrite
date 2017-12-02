import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Board, EditItem } from '../models/board';
import { BubbleTemp, BubbleType, LeafBubble } from '../models/bubble-temp';
import { BubbleService } from './bubble.service';

const tempUserId = 1;

@Injectable()
export class BoardService {

  tempId = 1;

  private previewUpdateEventSource = new Subject<void>();
  private createBubbleEventSource = new Subject<EditItem>();
  private finishBubbleEditEventSource = new Subject<BubbleTemp>();

  previewUpdateEvent$ = this.previewUpdateEventSource.asObservable();
  createBubbleEvent$ = this.createBubbleEventSource.asObservable();
  finishBubbleEditEvent$ = this.finishBubbleEditEventSource.asObservable();

  constructor(private _bubbleService: BubbleService) {
  }
/*
  updatePreview() {
    this.previewUpdateEventSource.next();
  }

  editBubble(bubble: BubbleTemp) {
    const newEditItem: EditItem = new EditItem(this.getId(), bubble);
    this.createBubbleEventSource.next(newEditItem);
  }

  public finishEdit(bubble: BubbleTemp, content: string) {
    this._bubbleService.editBubble(bubble, content).then(() => {
      this.finishBubbleEditEventSource.next(bubble);
      console.log(content);
    });
  }

  public getEditBubbles(): void {
    this._bubbleService.getBubbleList().then(bubbles =>
      bubbles.filter(b => (b.type !== BubbleType.internalBubble) && ((b as LeafBubble).ownerId === tempUserId))
             .forEach((b) => {
              this.editBubble(b);
            }));
  }

  public updateEdit(bubble: BubbleTemp, content: string) {
    this._bubbleService.editBubble(bubble, content);
  }

  private getId(): number {
    this.tempId ++;
    return this.tempId;
  }
*/
}
