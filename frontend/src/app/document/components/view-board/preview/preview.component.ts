import { Component, OnInit, Input } from '@angular/core';
import { getBubbleById } from '../../../reducers/bubble-operation';

import { BoardService } from '../../../services/board.service';
import { BubbleService } from '../../../services/bubble.service';
import { Bubble, InternalBubble, LeafBubble, BubbleType } from '../../../models/bubble';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent {

    @Input() rootBubble: InternalBubble;
    @Input() bubbleList: Array<Bubble>;

    constructor(
        private _boardService: BoardService,
        private _bubbleService: BubbleService) {
    }


    public getBubbleById(id: number): Bubble {
        return getBubbleById(this.bubbleList, id);
    }

    public isInternal(bubble: Bubble): boolean {
        return (bubble.type === BubbleType.internalBubble);
    }

} /* istanbul ignore next */
