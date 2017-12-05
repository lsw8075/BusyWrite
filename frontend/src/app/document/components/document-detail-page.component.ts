import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { DocumentService } from './service';
import { BubbleService } from '../services/bubble.service';
import { ServerSocket } from '../services/websocket.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../models/bubble';
import { User } from '../../user/models/user';
import { MenuType } from './service';

import * as fromUser from '../../user/reducers/reducer';
import * as fromDocument from '../reducers/reducer';

import * as BubbleAction from '../actions/bubble-action';
import * as RouterAction from '../../shared/route/route-action';

@Component({
  selector: 'app-document-detail-page',
  templateUrl: './document-detail-page.component.html',
  styleUrls: ['./document-detail-page.component.css'],
  providers: [ ServerSocket, BubbleService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DocumentDetailPageComponent implements OnInit {

    rootBubble$: Observable<InternalBubble>;
    bubbleList$: Observable<Array<Bubble>>;
    userId$: Observable<Number>;
    selectedBubbleList$: Observable<Bubble[]>;
    hoverBubbleList$: Observable<Bubble[]>;
    selectedMenu$: Observable<MenuType>;

    constructor(
        private _documentService: DocumentService,
        private _store: Store<fromDocument.State>
    ) {
        this.rootBubble$ = _store.select(fromDocument.getRootBubble);
        this.bubbleList$ = _store.select(fromDocument.getBubbleList);
        this.userId$ = this._store.select(fromUser.getUserId);
        this.selectedBubbleList$ = this._store.select(fromDocument.getSelectedBubbleList);
        this.hoverBubbleList$ = this._store.select(fromDocument.getHoverBubbleList);
        this.selectedMenu$ = this._store.select(fromDocument.getSelectedMenu);
    }

    ngOnInit() {
        this._store.dispatch(new BubbleAction.Open(1));
    }
} /* istanbul ignore next */
