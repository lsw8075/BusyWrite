import { Component, OnInit, Input } from '@angular/core';
import { SuggestBubble } from '../../../model/bubble';
import { EventSangjunBoardService } from '../../../service/event/event-sangjun-board.service';

@Component({
  selector: 'app-suggest-bubble',
  templateUrl: './suggest-bubble.component.html',
  styleUrls: ['./suggest-bubble.component.css']
})

export class SuggestBubbleComponent implements OnInit {

  @Input()
  suggestBubble: SuggestBubble;

  constructor(private _eventSangjunBoardService: EventSangjunBoardService) { }

  ngOnInit() {
  }

  clickBackButton() {
    this._eventSangjunBoardService.clickBackButton();
  }

}
