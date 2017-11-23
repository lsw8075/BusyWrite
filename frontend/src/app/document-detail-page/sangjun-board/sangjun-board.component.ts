import { Component, OnInit } from '@angular/core';
import { EventBubbleService } from '../../service/event/event-bubble.service';
import { EventSangjunBoardService } from '../../service/event/event-sangjun-board.service';
import { BubbleService } from '../../service/bubble.service';
import { Bubble, SuggestBubble } from '../../model/bubble';

@Component({
  selector: 'app-sangjun-board',
  templateUrl: './sangjun-board.component.html',
  styleUrls: ['./sangjun-board.component.css']
})
export class SangjunBoardComponent implements OnInit {
  isOBChecked = true;
  isSBChecked = true;
  isCommentChecked = true;
  bubble: Bubble;
  selectedSB: SuggestBubble;
  suggestBubbles: Array<SuggestBubble>;

  constructor(
    private _bubbleSerivce: BubbleService,
    private _eventBubbleService: EventBubbleService,
    private _eventSangjunBoardService: EventSangjunBoardService
  ) {
    _eventBubbleService.sangjunBoardOpenEvent$.subscribe((bubble) => {
      this.bubble = bubble;
      this.suggestBubbles = bubble.suggestBubbles;
    });

    _eventSangjunBoardService._backButtonClickEvent$.subscribe(() => {
      this.selectedSB = null;
    });

    _eventSangjunBoardService._switchClickEvent$.subscribe((suggestBubble) => {
      console.log('switch');
    });

    _eventSangjunBoardService._editClickEvent$.subscribe((suggestBubble) => {
      console.log('edit');
    });

    _eventSangjunBoardService._deleteClickEvent$.subscribe((suggestBubble) => {
      this.bubble.deleteSuggestBubble(suggestBubble);
      this.selectedSB = null;
      console.log('delete');
    });

    _eventSangjunBoardService._thumbsUpClickEvent$.subscribe((suggestBubble) => {
      suggestBubble.thumbUps++;
      this.suggestBubbles = this.suggestBubbles.sort((sb1, sb2) => sb2.thumbUps - sb1.thumbUps);
    });
  }

  clickSuggestBubble(suggestBubble: SuggestBubble) {
    this.selectedSB = suggestBubble;
  }

  clickThumbsUp(suggestBubble: SuggestBubble) {
    this._eventSangjunBoardService.clickThumbsUp(suggestBubble);
  }

  ngOnInit() {
  }

}
