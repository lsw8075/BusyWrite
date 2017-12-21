import { BubbleType, Bubble, LeafBubble, InternalBubble, SuggestBubble } from './bubble';
import { MockBubbleRoot } from './bubble.mock';
import { Note } from './note';
import { Comment } from './comment';

describe('LeafBubble', () => {
  describe('when create leaf bubble', () => {
    let leafBubble: LeafBubble;
    let id: number;
    let content: string;
    let ownerId: number;

    beforeEach(() => {
      id = 1;
      ownerId = 1;
      content = 'empty content';
      leafBubble = new LeafBubble(id, content, ownerId);
    });

    it('should return false when get edit lock for other user', () => {
      const otherUserId = 2;
      expect(otherUserId).not.toBe(ownerId);
    });
  });

});

describe('InternalBubble', () => {
  let id: number;
  let location: number;
  let parentBubble: Bubble;
  let internalBubble: InternalBubble;

  let leafBubble1: LeafBubble;
  let leafBubble2: LeafBubble;
  let internalBubble3: InternalBubble;
  let leafBubble4: LeafBubble;
  let leafBubble5: LeafBubble;
  let leafBubble6: LeafBubble;

  beforeEach(() => {
    id = 1;
    location = 0;
    parentBubble = null;

    leafBubble1 = new LeafBubble(2, 'leafBubble 1');
    leafBubble2 = new LeafBubble(3, 'leafBubble 2');

    leafBubble4 = new LeafBubble(5, 'leafBubble 4');
    leafBubble5 = new LeafBubble(6, 'leafBubble 5');
    leafBubble6 = new LeafBubble(7, 'leafBubble 6');
    internalBubble3 = new InternalBubble(4, [leafBubble4.id, leafBubble5.id]);
    internalBubble = new InternalBubble(id, [leafBubble1.id, leafBubble2.id, internalBubble3.id, leafBubble6.id]);
  });

  it('internal bubbles should have correct childs', () => {
    const children1 = internalBubble.childBubbleIds;
    expect(children1).toContain(leafBubble1.id, 'internal bubble contains leafbubble1');
    expect(children1).toContain(leafBubble2.id, 'internal bubble contains leafbubble2');
    expect(children1).toContain(internalBubble3.id, 'internal bubble contains internal bubble 3');
    expect(children1).toContain(leafBubble6.id, 'internal bubble contains leafbubble6');

    const children2 = internalBubble3.childBubbleIds;
    expect(children2).toContain(leafBubble4.id, 'internal bubble contains leafbubble4');
    expect(children2).toContain(leafBubble5.id, 'internal bubble contains leafbubble5');
  });
});
