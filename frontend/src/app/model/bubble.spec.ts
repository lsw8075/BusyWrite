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
      expect(leafBubble.getEditLock(otherUserId)).toBeFalsy();
    });

    it('should do nothing (return true) if edit lock for same user', () => {
      const sameUserId = ownerId;
      expect(leafBubble.getEditLock(sameUserId)).toBeTruthy();
    });

    it('should get edit lock after release', () => {
      leafBubble.releaseLock();
      const someUserId = 3;
      const someOtherUserId = 4;
      expect(leafBubble.getEditLock(someUserId)).toBeTruthy();
      expect(leafBubble.getEditLock(someOtherUserId)).toBeFalsy();
    });

    it('should return height as 1', () => {
      const leafBubbleHeight = 1;
      expect(leafBubble.getHeight()).toBe(leafBubbleHeight);
    });

    it('should be able to split bubble into 3 pieces', () => {

    });

    it('should be able to add new suggest bubble', () => {

    });

    it('should be able to delete new suggest bubble', () => {

    });

    it('should be able to add new comment', () => {

    });

    it('should be able to get content', () => {
      expect(leafBubble.getContent()).toBe(content);
    });

    it('should be able to get comments', () => {

    });

    it('should be able to get suggest bubbles', () => {

    });
  });

  describe('when create leaf bubble without owner and content', () => {
    let leafBubble: LeafBubble;
    let id: number;

    beforeEach(() => {
      id = 1;
      leafBubble = new LeafBubble(id);
    });

    it('should get edit lock', () => {
      const someUserId = 3;
      expect(leafBubble.getEditLock(someUserId)).toBeTruthy();
    });

    it('should get edit lock after release', () => {
      leafBubble.releaseLock();
      const someUserId = 3;
      const someOtherUserId = 4;
      expect(leafBubble.getEditLock(someUserId)).toBeTruthy();
      expect(leafBubble.getEditLock(someOtherUserId)).toBeFalsy();
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
    internalBubble3 = new InternalBubble(4, [leafBubble4, leafBubble5]);
    internalBubble = new InternalBubble(id, [leafBubble1, leafBubble2, internalBubble3, leafBubble6]);
  });

  it('internal bubbles should have correct childs', () => {
    const children1 = internalBubble.childBubbles;
    expect(children1).toContain(leafBubble1, 'internal bubble contains leafbubble1');
    expect(children1).toContain(leafBubble2, 'internal bubble contains leafbubble2');
    expect(children1).toContain(internalBubble3, 'internal bubble contains internal bubble 3');
    expect(children1).toContain(leafBubble6, 'internal bubble contains leafbubble6');

    const children2 = internalBubble3.childBubbles;
    expect(children2).toContain(leafBubble4, 'internal bubble contains leafbubble4');
    expect(children2).toContain(leafBubble5, 'internal bubble contains leafbubble5');
  });

  it('getHeight should return correct height', () => {
    expect(internalBubble.getHeight()).toBe(3);
  });

  it('leaf bubbles should have correct location', () => {
    expect(leafBubble1.location).toBe(0);
    expect(leafBubble2.location).toBe(1);
    expect(internalBubble3.location).toBe(2);
    expect(leafBubble6.location).toBe(3);
    // internal bubble 3
    expect(leafBubble4.location).toBe(0);
    expect(leafBubble5.location).toBe(1);
  });

  it('should be able to flatten child bubble', () => {
    const flattendBubble = internalBubble.flattenChild(internalBubble3);
    expect(flattendBubble.type).toBe(BubbleType.leafBubble);
    expect(flattendBubble.getContent()).toBe(`leafBubble 4\nleafBubble 5`);
  });


  it('should throw error when inserting bubble at invalid location', () => {
    const leafBubble7 = new LeafBubble(7);
    expect(function(){ internalBubble.insertChild(leafBubble7, -1); }).toThrow(new Error('location -1 is invalid'));
    expect(function(){ internalBubble.insertChild(leafBubble7, 6); }).toThrow(new Error('location 6 is invalid'));
  });

  it('should insert bubble at valid location, other bubbles should also move', () => {
    const leafBubble7 = new LeafBubble(7);
    internalBubble.insertChild(leafBubble7, 2);
    expect(leafBubble1.location).toBe(0);
    expect(leafBubble2.location).toBe(1);
    expect(leafBubble7.location).toBe(2);
    expect(internalBubble3.location).toBe(3);
    expect(leafBubble6.location).toBe(4);
  });

  it('should be able to get content of all childs', () => {
    const contentTree = `leafBubble 1\nleafBubble 2\nleafBubble 4\nleafBubble 5\nleafBubble 6`;
    expect(internalBubble.getContent()).toBe(contentTree);
  });

  it('should be able to delete leaf child', () => {
    internalBubble.deleteChild(leafBubble2);
    expect(internalBubble.childBubbles).not.toContain(leafBubble2);
  });

  it('should be able to delete internal child', () => {
    internalBubble.deleteChild(internalBubble3);
    expect(internalBubble.childBubbles).not.toContain(internalBubble3);
  });

  it('should throw error when delete bubble that is not child', () => {
    const errorMsg = `bubble(id: ${leafBubble5.id}) is not child of bubble(id: ${internalBubble.id})`;
    expect(function() { internalBubble.deleteChild(leafBubble5); }).toThrow(new Error(errorMsg));
  });

  it('should be able to wrap adjacent children (could be out of order)', () => {
    const wrapList: Array<Bubble> = [leafBubble2, leafBubble6, internalBubble3];
    const wrapBubble: InternalBubble = internalBubble.wrapChildren(wrapList);
    expect(internalBubble.getHeight()).toBe(4);
    expect(wrapBubble.getHeight()).toBe(3);
    expect(wrapBubble.childBubbles).toContain(leafBubble2);
    expect(wrapBubble.childBubbles).toContain(leafBubble6);
    expect(wrapBubble.childBubbles).toContain(internalBubble3);
    expect(internalBubble.childBubbles).toContain(wrapBubble);
  });

  it('should not do anything when wrap is redundant');

  it('should throw error when wrap un-adjacent children', () => {
    const wrapList: Array<Bubble> = [leafBubble1, leafBubble6, internalBubble3];
    const errorMsg = `given bubbles are un-ajacent`;
    expect(function() { internalBubble.wrapChildren(wrapList); }).toThrow(new Error(errorMsg));
  });

  it('should throw error when wrap non children', () => {
    const wrapList: Array<Bubble> = [leafBubble1, leafBubble6, leafBubble4];
    const errorMsg = `given bubbles are not child`;
    expect(function() { internalBubble.wrapChildren(wrapList); }).toThrow(new Error(errorMsg));
  });


  it('should be able to split bubble into 3 pieces', () => {

  });

  it('should be able to add new suggest bubble', () => {

  });

  it('should be able to delete new suggest bubble', () => {

  });

  it('should be able to add new comment', () => {

  });

  it('should be able to get comments', () => {

  });

  it('should be able to get suggest bubbles', () => {

  });


});

describe('RootBubble', () => {

});

describe('SuggestBubble', () => {
});

