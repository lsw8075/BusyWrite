import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BubbleType, Bubble, MenuType, ActionType } from '../service';
import { BubbleService } from '../service';
import { EventBubbleService } from '../../../services/event/event-bubble.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { SplitBubbleComponent } from '../split-bubble/split-bubble.component';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../../reducers/reducer';
import * as BubbleAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';


@Component({
  selector: 'app-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.css']
})
export class BubbleMenuComponent implements OnInit {

  menuType = MenuType;
  @Input() menu: MenuType;
  @Input() bubble: Bubble;

  bsModalRef: BsModalRef;


  constructor(
    private _store: Store<fromDocument.State>,
    private _bubbleSerivce: BubbleService,
    private _eventBubbleService: EventBubbleService,
    private _modalService: BsModalService) {
  }

  ngOnInit() {}

  public isWrapSelected(): boolean {
    return this._eventBubbleService.getActionState() === ActionType.wrap;
  }

  public isMoveSelected(): boolean {
    return this._eventBubbleService.getActionState() === ActionType.move;
  }

  public openSangjunBoard() {
    // this._eventBubbleService.openSangjunBoard(this.bubble);
  }

  public splitBubble() {
  //  this._store.dispatch(new BubbleAction.Split(this.bubble));
    this.bsModalRef = this._modalService.show(SplitBubbleComponent);
    this.bsModalRef.content.bubble = this.bubble;
  }

  public popBubble() {
  //  this._store.dispatch(new BubbleAction.Pop(this.bubble));
  }

  public wrapBubble() {
  //  this._eventBubbleService.wrapBubble(this.bubble);
  }

  public wrap() {
    // this._eventBubbleService.wrap();
  }

  public createBubble() {
    const bubble = this.bubble;
    const menu = this.menu;
  //  this._store.dispatch(new BubbleAction.Create({bubble, menu}));
  }

  public editBubble() {
  //  this._store.dispatch(new BubbleAction.Edit(this.bubble));
  }

  public deleteBubble() {
  //  this._store.dispatch(new BubbleAction.Delete(this.bubble));
  }

  public mergeBubble() {
  //  this._store.dispatch(new BubbleAction.Merge(this.bubble));
  }

  public flattenBubble() {
    // this._eventBubbleService.flattenBubble(this.bubble);
  }

  public moveBubble() {
    // this._eventBubbleService.moveBubble(this.bubble, this.menu);
  }

  public getAction(): string {
   switch (this._eventBubbleService.getActionState()) {
     case ActionType.move:
      return 'move bubble';
     case ActionType.split:
      return 'split bubble';
     default:
      return '';
   }
  }

} /* istanbul ignore next */
