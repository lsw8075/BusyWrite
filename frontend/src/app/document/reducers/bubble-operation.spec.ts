import { Bubble, BubbleType, InternalBubble, LeafBubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';

import { MockBubbleList } from '../models/bubble.mock';
import * as _ from 'lodash';

import {
    getBubbleById,
    isBubbleInList,
    getParentBubble, deleteChildBubbles,
    mouseOverBubble,
    deleteBubble, popBubble, getContent, flattenBubble, createBubble,
    editBubble, mergeBubble, wrapBubble, moveBubble, splitBubble} from './bubble-operation';

describe('bubble operations (pure functions)', () => {
    let bubbleList: Array<Bubble>;

    beforeEach(() => {
        for (const bubble of MockBubbleList) {
            if (bubble.type === BubbleType.internalBubble) {
                const internalBubble = bubble as InternalBubble;
                for (let i = 0; i < internalBubble.childBubbleIds.length; i++) {
                    const childBubbleId = internalBubble.childBubbleIds[i];
                    MockBubbleList[childBubbleId].parentBubbleId = internalBubble.id;
                    MockBubbleList[childBubbleId].location = i;
                }
            }
        }
        bubbleList = _.cloneDeep(MockBubbleList);
    });

    // have different describe wrapper for each function test
    describe('getBubbleById', () => {
        it('MockBubbleList should get bubble by id', () => {
            const bubble = getBubbleById(bubbleList, 1);
            expect(bubble.id).toBe(1);
        });
        it('empty bubblelist should not get bubble by id', () => {
            expect(function() {getBubbleById([], 1)}).toThrowError();
        });
    });

    describe('isBubbleInList', () => {
        it('should return true if it is in list', () => {
            expect(isBubbleInList(bubbleList, 1)).toBeTruthy();
        });
        it('should return false if it is not', () => {
            expect(isBubbleInList(bubbleList, -1)).toBeFalsy();
        });
    });

    describe('getParentBubble', () => {
        it('should get parent bubble', () => {
            const bubble = getBubbleById(bubbleList, 4);
            const parentBubble = getParentBubble(bubbleList, bubble);
            expect(parentBubble.id).toBe(0);
        });
        it('should throw error when it does not have parent', () => {
            expect(function() {getParentBubble(bubbleList, getBubbleById(bubbleList, 0))}).toThrowError();
        });
    });

    describe('deleteBubble', () => {
        it('should delete bubble with id', () => {
            deleteBubble(bubbleList, 1);
            expect(bubbleList.length).toBe(15);
        });
    });

    describe('popBubble', () => {
        it('should pop child bubble with id', () => {
            popBubble(bubbleList, 1);
            expect(bubbleList.length).toBe(17);
        });
    });

    describe('getContent', () => {
        it('should get content of internal bubble', () => {
            expect(getContent(bubbleList, 1)).toBe('<h1 class="ql-align-center">Title</h1> <h3>Subtitle</h3> ');
        });
    });

    describe('flattenBubble', () => {
        it('should flatten internal bubble', () => {
            flattenBubble(bubbleList, 1, new LeafBubble(99));
            expect(bubbleList.length).toBe(16);
        });
    });
});
