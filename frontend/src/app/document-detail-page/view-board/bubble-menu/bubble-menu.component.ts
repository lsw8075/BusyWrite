import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BubbleType, Bubble, LeafBubble, InternalBubble } from '../../document-detail-page.component';
import { BubbleService } from '../../document-detail-page.component';

export enum MenuType {
  borderTopMenu = 1,
  borderBottomMenu,
  leafMenu,
  internalMenu,
}

export enum ActionType {
  openSangjun = 1,
  split,
  pop,
  wrap,
  create,
  edit,
  delete,
}

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
    private _bubbleSerivce: BubbleService
  ) { }

  ngOnInit() {}

  public openSangjunBoardEvent() {
    const act = ActionType.openSangjun;
    const bubble = this.bubble;
    const menu = this.menu;
    const event = {
      act, bubble, menu
    };
    this.action.emit(event);
  }

  public splitBubbleEvent() {
    const act = ActionType.split;
    const bubble = this.bubble;
    const menu = this.menu;
    const event = {
      act, bubble, menu
    };
    this.action.emit(event);
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
