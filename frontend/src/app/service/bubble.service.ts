import { Injectable } from '@angular/core';
import { Bubble, LeafBubble, InternalBubble, SuggestBubble} from '../model/bubble';

@Injectable()
export class BubbleService {

  constructor() { }

  getBubbleById(id: number): LeafBubble | InternalBubble {
    return null;
  }

}
