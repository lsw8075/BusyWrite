import { Component, OnInit, Input } from '@angular/core';
import { SuggestBubbleTemp } from '../../../models/bubble-temp';
import { EventSangjunBoardService } from '../../../services/event/event-sangjun-board.service';

@Component({
  selector: 'app-suggest-bubble',
  templateUrl: './suggest-bubble.component.html',
  styleUrls: ['./suggest-bubble.component.css']
})

export class SuggestBubbleComponent implements OnInit {

  @Input()
  suggestBubble: SuggestBubbleTemp;

  constructor(private _eventSangjunBoardService: EventSangjunBoardService) { }

  ngOnInit() {
  }

  clickBackButton() {
    this._eventSangjunBoardService.clickBackButton();
  }

  clickSwitch() {
    this._eventSangjunBoardService.clickSwitch(this.suggestBubble);
  }

  clickEdit() {
    this._eventSangjunBoardService.clickEdit(this.suggestBubble);
  }

  clickDelete() {
    this._eventSangjunBoardService.clickDelete(this.suggestBubble);
  }

  clickThumbsUp() {
    this._eventSangjunBoardService.clickThumbsUp(this.suggestBubble);
  }

}
