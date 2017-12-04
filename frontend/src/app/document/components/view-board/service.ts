export { BubbleService, BoardService } from '../service';
export { Board } from '../service';
export { EventBubbleService, MenuType, ActionType, BubbleType } from '../service';
import { Bubble } from '../service';

export function getBubbleFromListById(bubbleList: Array<Bubble>, id: number): Bubble {
    for (const bubble of bubbleList) {
        if (bubble.id === id) {
            return bubble;
        }
    }
    return null;
}

export { Bubble };
