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

fdescribe('bubble operations (pure functions)', () => {
    const bubbleList: Array<Bubble>;

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
    fdescribe('getBubbleById', () => {
        fit('MockBubbleList should get bubble by id', () => {
            const bubble = getBubbleById(bubbleList, 1);
            expect(bubble.id).toBe(1);
        });
        fit('empty bubblelist should not get bubble by id', () => {
            expect(function() {getBubbleById([], 1)}).toThrowError();
        });
    });

    fdescribe('isBubbleInList', () => {
        fit('should return true if it is in list', () => {
            expect(isBubbleInList(bubbleList, 1)).toBeTruthy();
        });
        fit('should return false if it is not', () => {
            expect(isBubbleInList(bubbleList, -1)).toBeFalsy();
        });
    });

    fdescribe('getParentBubble', () => {
        fit('should get parent bubble', () => {
            const bubble = getBubbleById(bubbleList, 4);
            const parentBubble = getParentBubble(bubbleList, bubble);
            expect(parentBubble.id).toBe(0);
        });
        fit('should throw error when it does not have parent', () => {
            expect(function() {getParentBubble(bubbleList, getBubbleById(bubbleList, 0))}).toThrowError();
        });
    });

    fdescribe('deleteBubble', () => {
        fit('should delete bubble with id', () => {
            deleteBubble(bubbleList, 1);
            expect(bubbleList.length).toBe(15);
        });
    });

    fdescribe('popBubble', () => {
        fit('should pop child bubble with id', () => {
            popBubble(bubbleList, 1);
            expect(bubbleList.length).toBe(17);
        });
    });

    fdescribe('getContent', () => {
        fit('should get content of internal bubble', () => {
            expect(getContent(bubbleList, 1)).toBe('<h1 class="ql-align-center">Title</h1> <h3>Subtitle</h3> ');
        });
    });

    fdescribe('flattenBubble', () => {
        fit('should flatten internal bubble', () => {
            flattenBubble(bubbleList, 1, new LeafBubble(99));
            expect(bubbleList.length).toBe(16);
        });
    });
});
