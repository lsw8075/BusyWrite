import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MenuType, ActionType } from '../service';
import { BubbleService } from '../service';
import { EventBubbleService } from '../../../services/event/event-bubble.service';
import { BubbleType, Bubble, LeafBubble, InternalBubble } from '../../../models/bubble';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { SplitBubbleComponent } from '../split-bubble/split-bubble.component';

import { getBubbleById } from '../../../reducers/bubble-operation';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../../reducers/reducer';
import * as fromBubble from '../../../reducers/bubble-reducer';
import * as BubbleAction from '../../../actions/bubble-action';
import * as BoardAction from '../../../actions/board-action';
import * as SangjunBoardAction from '../../../actions/sangjun-bubble-action';
import * as EditBoardAction from '../../../actions/edit-board-action';
import * as RouterAction from '../../../../shared/route/route-action';

@Component({
  selector: 'app-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.css']
})
export class BubbleMenuComponent {

    menuType = MenuType;
    @Input() bubble: Bubble;
    @Input() menu: MenuType;
    @Input() bubbleList: Array<Bubble>;

    bsModalRef: BsModalRef;

    constructor(
        private _store: Store<fromDocument.State>,
        private _bubbleSerivce: BubbleService,
        private _eventBubbleService: EventBubbleService,
        private _modalService: BsModalService) {
    }

    public openSangjunBoard() {
        this._store.dispatch(new BoardAction.ShowSangjun());
        this._store.dispatch(new BubbleAction.SelectClear());
        this._store.dispatch(new SangjunBoardAction.Open(this.bubble));
    }

    public splitBubble() {
        this._store.dispatch(new BubbleAction.SplitLeafStart(this.bubble));

       this.bsModalRef = this._modalService.show(SplitBubbleComponent);
       this.bsModalRef.content.bubble = this.bubble;
    }

    public popBubble() {
        this._store.dispatch(new BubbleAction.PopBubble(this.bubble.id));
    }

    public createBubble() {
        this._store.dispatch(new BoardAction.ShowEdit());
        this._store.dispatch(new BubbleAction.CreateBubble({bubbleId: this.bubble.id, isAbove: this.menu === MenuType.borderTopMenu}));
    }

    public editBubble() {
        this._store.dispatch(new BoardAction.ShowEdit());
        this._store.dispatch(new BubbleAction.EditBubble(this.bubble.id));
    }

    public deleteBubble() {
        this._store.dispatch(new BubbleAction.DeleteBubble(this.bubble.id));
    }

    public mergeBubble() {
        this._store.dispatch(new BubbleAction.MergeStart());
    }

    public wrapBubble() {
        this._store.dispatch(new BubbleAction.WrapStart());
    }

    public flattenBubble() {
        this._store.dispatch(new BubbleAction.FlattenBubble(this.bubble.id));
    }

    public moveBubble() {
        this._store.dispatch(new BubbleAction.MoveBubbleStart(this.bubble));
    }

  public isBeingEditted(bubble: Bubble): boolean {
        if (bubble.type === BubbleType.leafBubble) {
            return (bubble as LeafBubble).ownerId !== -1;
        }
        return (bubble as InternalBubble).childBubbleIds
            .reduce((prev, curr) => prev || this.isBeingEditted(getBubbleById(this.bubbleList, curr)), false);
    }

} /* istanbul ignore next */
