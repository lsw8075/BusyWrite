import { Bubble } from './bubble';
import { BubbleJsonHelper } from './bubble-json-helper';

describe('bubble json helper', () => {
  beforeEach(() => {
    bubbleJsonHelper = new BubbleJsonHelper;
  });

  it('should create a new bubble with json string', () => {
    jsonString = '{"id": 1, "thumbUps": 10}';
    let bubble = bubbleJsonHelper.getBubbleObject(json);
    console.log(bubble);
    expect(bubble.thumbUps).toBe(10);
  });
});
