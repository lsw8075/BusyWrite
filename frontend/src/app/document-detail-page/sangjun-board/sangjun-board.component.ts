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
    private _eventSangjunBoardService: EventSangjunBoardService) {

    _eventBubbleService.sangjunBoardOpenEvent$.subscribe((bubble) => {
      console.log(bubble);
      this.bubble = bubble;
      this.suggestBubbles = bubble.suggestBubbles;
    });
    _eventSangjunBoardService._backButtonClickEvent$.subscribe(() => {
      console.log('back button clicked');
      this.selectedSB = null;
    });
  }

  clickSuggestBubble(suggestBubble: SuggestBubble) {
    console.log(`clicked ${suggestBubble.id}`);
    this.selectedSB = suggestBubble;
  }

  clickThumbsUp(suggestBubble: SuggestBubble) {
    console.log('clicked thumbs up');
    suggestBubble.thumbUps++;
  }

  ngOnInit() {
  }

}
