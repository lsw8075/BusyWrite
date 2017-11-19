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

  @Output() action = new EventEmitter();

  menuType = MenuType;
  @Input() menu: MenuType;
  @Input() bubble: Bubble;

  constructor(
    private _bubbleSerivce: BubbleService,
    private _eventBubbleService: EventBubbleService) {
  }

  ngOnInit() {}

  public openSangjunBoard() {
    this._eventBubbleService.openSangjunBoard(this.bubble);
  }

  public splitBubble() {
    this._eventBubbleService.splitBubble(this.bubble);
  }

  public popBubbleEvent() {
    const act = ActionType.pop;
    const bubble = this.bubble;
    const menu = this.menu;
    const event = {
      act, bubble, menu
    };
    this.action.emit(event);
  }

  public wrapBubbleEvent() {
    const act = ActionType.wrap;
    const bubble = this.bubble;
    const menu = this.menu;
    const event = {
      act, bubble, menu
    };
    this.action.emit(event);
  }

  public createBubbleEvent() {
    const act = ActionType.create;
    const bubble = this.bubble;
    const menu = this.menu;
    const event = {
      act, bubble, menu
    };
    this.action.emit(event);
  }

  public editBubbleEvent() {
    const act = ActionType.edit;
    const bubble = this.bubble;
    const menu = this.menu;
    const event = {
      act, bubble, menu
    };
    this.action.emit(event);

  }

  public deleteBubbleEvent() {
    const act = ActionType.delete;
    const bubble = this.bubble;
    const menu = this.menu;
    const event = {
      act, bubble, menu
    };
    this.action.emit(event);
  }



} /* istanbul ignore next */

export { MenuType, ActionType };
