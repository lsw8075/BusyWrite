import { Component, OnInit, Input } from '@angular/core';
import { SuggestBubble } from '../../../model/bubble';

@Component({
  selector: 'app-suggest-bubble',
  templateUrl: './suggest-bubble.component.html',
  styleUrls: ['./suggest-bubble.component.css']
})

export class SuggestBubbleComponent implements OnInit {

  @Input()
  suggestBubble: SuggestBubble;

  constructor() { }

  ngOnInit() {
  }

}
