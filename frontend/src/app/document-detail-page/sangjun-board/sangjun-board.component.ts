import { Component, OnInit } from '@angular/core';
import { EventBubbleService } from '../../service/event/event-bubble.service';
import { BubbleService } from '../../service/bubble.service';
import { Bubble, SuggestBubble } from '../../model/bubble';

@Component({
  selector: 'app-sangjun-board',
  templateUrl: './sangjun-board.component.html',
  styleUrls: ['./sangjun-board.component.css']
})
export class SangjunBoardComponent implements OnInit {
  isSBChecked: boolean = true;
  isCommentChecked: boolean = true;
  bubble: Bubble;
  suggestBubbles: Array<SuggestBubble>;

  constructor(
    private _bubbleSerivce: BubbleService,
    private _eventBubbleService: EventBubbleService) {

    _eventBubbleService.sangjunBoardOpenEvent$.subscribe((bubble) => {
      console.log(bubble);
      this.bubble = bubble;
      this.suggestBubbles = bubble.suggestBubbles;
    });
  }

  ngOnInit() {
  }

}
