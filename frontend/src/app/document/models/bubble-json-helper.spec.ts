import { Bubble } from './bubble';
import { BubbleJsonHelper } from './bubble-json-helper';

describe('bubble json helper', () => {
  beforeEach(() => {
    bubbleJsonHelper = new BubbleJsonHelper;
  });

  it('should create new bubble list with json string', () => {
    const jsonString = '[{"id":2, "content":"hello", "thumbUps":28},{"id":1, "thumbUps":10}]';
    const bubbleList = bubbleJsonHelper.getBubbleArrayObject(jsonString);
    expect(bubbleList[0].thumbUps).toBe(28);
  });
});
