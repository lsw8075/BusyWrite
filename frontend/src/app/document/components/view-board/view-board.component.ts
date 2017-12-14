import { Component, OnInit, Output, Input, ChangeDetectionStrategy } from '@angular/core';


import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { MenuType, ActionType, Board } from './service';

import { PreviewComponent } from './preview/preview.component';

import { BubbleService } from './service';
import { BoardService } from '../../services/board.service';
import { EventBubbleService } from '../../services/event/event-bubble.service';

import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../../models/bubble';
import { BoardType } from '../../models/board';

import { BubbleJsonHelper } from '../../models/bubble-json-helper';

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
    private _eventBubbleService: EventBubbleService) {}

    ngOnInit() {

    }

} /* istanbul ignore next */
