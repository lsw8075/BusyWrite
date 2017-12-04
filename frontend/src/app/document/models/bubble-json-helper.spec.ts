import { Bubble, BubbleType } from './bubble';
import { BubbleJsonHelper } from './bubble-json-helper';

describe('bubble json helper', () => {
    let bubbleJsonHelper: BubbleJsonHelper;
  beforeEach(() => {
    bubbleJsonHelper = new BubbleJsonHelper;
  });

  it('should create new bubble list with json string', () => {
    const jsonString = '[{"id":2, "content":"hello", "parentBubbleId":28},{"id":1, "child_bubble":[1,2,3], "parentBubbleId":99}]';
    const bubbleList = bubbleJsonHelper.getBubbleArrayObject(jsonString);
    expect(bubbleList[0].type).toBe(BubbleType.leafBubble);
  });
});
