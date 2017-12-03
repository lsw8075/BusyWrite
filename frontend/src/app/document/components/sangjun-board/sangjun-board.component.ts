import { Component, OnInit } from '@angular/core';
import { EventBubbleService } from '../../services/event/event-bubble.service';
import { EventSangjunBoardService } from '../../services/event/event-sangjun-board.service';
import { BubbleService } from '../../services/bubble.service';
import { BubbleTemp, SuggestBubbleTemp } from '../../models/bubble-temp';

@Component({
  selector: 'app-sangjun-board',
  templateUrl: './sangjun-board.component.html',
  styleUrls: ['./sangjun-board.component.css']
})
export class SangjunBoardComponent implements OnInit {
  isOBChecked = true;
  isSBChecked = true;
  isCommentChecked = true;
  isWatching = false;
  bubble: BubbleTemp;
  selectedSB: SuggestBubbleTemp;
  suggestBubbles: Array<SuggestBubbleTemp>;

  constructor(
    private _bubbleSerivice: BubbleService,
    private _eventBubbleService: EventBubbleService,
    private _eventSangjunBoardService: EventSangjunBoardService
  ) {
    _eventBubbleService.sangjunBoardOpenEvent$.subscribe((bubble) => {
      this.bubble = bubble;
      this.suggestBubbles = bubble.suggestBubbles;
      this.isOBChecked = true;
      this.isSBChecked = true;
      this.isCommentChecked = true;
      this.isWatching = false;
      this.selectedSB = null;
      _eventBubbleService.clearState();
    });

    _eventSangjunBoardService._backButtonClickEvent$.subscribe(() => {
      this.selectedSB = null;
    });

    _eventSangjunBoardService._switchClickEvent$.subscribe((suggestBubble) => {
      console.log('switch');
    //  this.bubble = _bubbleSerivice.switchBubble(this.bubble, suggestBubble);
      this.suggestBubbles = this.bubble.suggestBubbles;
      this.suggestBubbles = this.suggestBubbles.sort((sb1, sb2) => sb2.thumbUps - sb1.thumbUps);
      this.selectedSB = null;
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

  clickSuggestBubble(suggestBubble: SuggestBubbleTemp) {
    this.selectedSB = suggestBubble;
  }

  clickSBThumbsUp(suggestBubble: SuggestBubbleTemp) {
    this._eventSangjunBoardService.clickThumbsUp(suggestBubble);
  }

  clickBubbleThumbsUp() {
    this.bubble.thumbUps++;
  }

  clickWatch() {
    this.isWatching = true;
  }

  clickUnwatch() {
    this.isWatching = false;
  }

  ngOnInit() {
  }

}
