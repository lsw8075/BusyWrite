import { Injectable } from '@angular/core';
import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from '../model/bubble';

@Injectable()
export class BubbleService {

  constructor() { }

  getBubbleById(id: number): LeafBubble | InternalBubble {
    const temp = new LeafBubble();
    temp.content = 'test bubble';
    return temp;
  }

}
