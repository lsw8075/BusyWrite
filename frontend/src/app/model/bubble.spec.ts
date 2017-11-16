import { Bubble, LeafBubble, InternalBubble, SuggestBubble } from './bubble';
import { MockBubbleRoot } from './bubble.mock';
import { Note } from './note';
import { Comment } from './comment';

describe('LeafBubble', () => {
  describe('when create leaf bubble', () => {
    let leafBubble: LeafBubble;
    let id: number;
    let location: number;
    let parentBubble: Bubble;
    let ownerId: number;
    let content: string;

    beforeEach(() => {
      id = 1;
      location = 0;
      parentBubble = null;
      ownerId = 1;
      content = 'empty content';
      leafBubble = new LeafBubble(id, location, parentBubble, ownerId, content);
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
    let location: number;
    let parentBubble: Bubble;

    beforeEach(() => {
      id = 1;
      location = 0;
      parentBubble = null;
      leafBubble = new LeafBubble(id, location, parentBubble);
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

});

describe('RootBubble', () => {

});

describe('SuggestBubble', () => {
});

