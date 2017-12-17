import { Component, OnInit, Output, Input, ChangeDetectionStrategy } from '@angular/core';


import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { MenuType, ActionType } from './service';

import { PreviewComponent } from './preview/preview.component';

import { BubbleService } from './service';
import { BoardService } from '../../services/board.service';
import { EventBubbleService } from '../../services/event/event-bubble.service';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../../models/bubble';

import { Board } from '../../models/board';

import { BubbleJsonHelper } from '../../models/bubble-json-helper';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../../user/reducers/reducer';
import * as fromDocument from '../../reducers/reducer';

import { TdLoadingService } from '@covalent/core/loading/services/loading.service';

@Component({
    selector: 'app-view-board',
    templateUrl: './view-board.component.html',
    styleUrls: ['./view-board.component.css', '../board-style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ViewBoardComponent implements OnInit {

    @Input() board: Board;
    @Input() rootBubble: InternalBubble;
    @Input() bubbleList: Array<Bubble>;
    @Input() userId: number;
    @Input() selectedBubbleList: Array<Bubble>;
    @Input() hoverBubbleList: Array<Bubble>;
    @Input() selectedMenu: MenuType;

  constructor(
    private _boardService: BoardService,
    private _bubbleService: BubbleService,
    private _eventBubbleService: EventBubbleService,
    private _store: Store<fromDocument.State>,
    private _loadingService: TdLoadingService) {
        this._store.select(fromDocument.isLoading).subscribe(loading => {
            if (this.board) {
                // if (loading) {
                //     this._loadingService.register(this.getBoardId());
                // } else {
                //     this._loadingService.resolve(this.getBoardId());
                // }
            }
        });
    }

    public getBoardId(): string {
        return 'board_' + this.board.id;
    }

    ngOnInit() {
        console.log('thi', this.board);
    }

} /* istanbul ignore next */
