import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BubbleType, Bubble, MenuType, ActionType } from '../service';
import { BubbleService } from '../service';
import { EventBubbleService } from '../../../service/event/event-bubble.service';

@Component({
  selector: 'app-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.css']
})
export class BubbleMenuComponent implements OnInit {

  menuType = MenuType;
  @Input() menu: MenuType;
  @Input() bubble: Bubble;
  editLock: boolean;

  constructor(
    private _bubbleSerivce: BubbleService,
    private _eventBubbleService: EventBubbleService) {
  }

  ngOnInit() {
    if (this.bubble.isBeingEditted()) {
      this.editLock = true;
    }
  }

  public openSangjunBoard() {
    this._eventBubbleService.openSangjunBoard(this.bubble);
  }

  public splitBubble() {
    this._eventBubbleService.splitBubble(this.bubble);
  }

  public popBubble() {
    this._eventBubbleService.popBubble(this.bubble);
  }

  public wrapBubble() {
    this._eventBubbleService.wrapBubble(this.bubble);
  }

  public createBubble() {
    this._eventBubbleService.createBubble(this.bubble, this.menu);
  }

  public editBubble() {
    this._eventBubbleService.editBubble(this.bubble);
  }

  public deleteBubble() {
    this._eventBubbleService.deleteBubble(this.bubble);
  }

  public flattenBubble() {
    this._eventBubbleService.flattenBubble(this.bubble);
  }

  public moveBubble() {
    this._eventBubbleService.moveBubble(this.bubble);
  }

} /* istanbul ignore next */
