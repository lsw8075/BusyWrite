import { Bubble, LeafBubble, InternalBubble, SuggestBubble } from './bubble';



function makeRootBubble(): Bubble {
  const id = 0;
  const location = 0;
  const parentBubble = null;
  return new InternalBubble(id, location, parentBubble);
}

const MockBubbleRoot: Bubble = makeRootBubble();

export { MockBubbleRoot };
