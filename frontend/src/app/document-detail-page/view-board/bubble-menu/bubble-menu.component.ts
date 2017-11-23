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

  constructor(
    private _bubbleSerivce: BubbleService,
    private _eventBubbleService: EventBubbleService) {
  }

  ngOnInit() {}

  public isWrapSelected(): boolean {
    return this._eventBubbleService.getActionState() === ActionType.wrap;
  }

  public isMoveSelected(): boolean {
    return this._eventBubbleService.getActionState() === ActionType.move;
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

  public wrap() {
    this._eventBubbleService.wrap();
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
    this._eventBubbleService.moveBubble(this.bubble, this.menu);
  }

  public getAction(): string {
   switch (this._eventBubbleService.getActionState()) {
     case ActionType.move:
      return 'move bubble';
     default:
      return '';
   }
  }

} /* istanbul ignore next */
