import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';
import { MenuType } from '../services/event/event-bubble.service';
import { Comment } from '../models/comment';

import { MockBubbleList } from '../models/bubble.mock';
import * as _ from 'lodash';

import {
    getBubbleById,
    isBubbleInList,
    getParentBubble, deleteChildBubbles,
    mouseOverBubble,
    removeBubbleById,
    deleteBubble, popBubble, getContent, flattenBubble, createBubble,
    editBubble, mergeBubble, wrapBubble, moveBubble, splitBubble, getSuggestBubbleById, switchBubble} from './bubble-operation';

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

    describe('getSuggestBubbleById', () => {

        it('find suggest bubble', () => {
            const sblist = [new SuggestBubble(1, 'hi', 1)];
            expect(getSuggestBubbleById(sblist, 1).content).toBe('hi');
        });

        it('throw error', () => {
            const sblist = [new SuggestBubble(1, 'hi', 1)];
            expect(() => {
                getSuggestBubbleById(sblist, 2);
            }).toThrowError('Does not exist with this id: 2');
        });

    });

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
            popBubble(bubbleList, 1000);
            popBubble(bubbleList, 3);
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

    describe('remove bubble by id', () => {

        it('remove bubble', () => {
            const bList = [new LeafBubble(1, 'hi')];
            removeBubbleById(bList, 1);
            expect(bList.length).toBe(0);
        });

        it('throw error', () => {
            const bList = [new LeafBubble(1, 'hi')];
            expect(() => {
                removeBubbleById(bList, 2);
            }).toThrowError('Does not exist with this id');
        });

    });

    describe('create bubble', () => {
        it('create bubble', () => {
            createBubble(bubbleList, new LeafBubble(1, ''));
            const b = new LeafBubble(100, '');
            b.parentBubbleId = 4;
            createBubble(bubbleList, b);
            expect(bubbleList.length).toBe(19);
        });
    });

    describe('edit bubble', () => {
        it('edit bubble', () => {
            editBubble(bubbleList, 3, 'new');
            editBubble(bubbleList, 4, 'new');
            expect((getBubbleById(bubbleList, 3) as LeafBubble).content).toBe('new');
        });
    });

    describe('merge bubble', () => {
        it('merge bubble', () => {
            const b = new LeafBubble(21);
            b.parentBubbleId = 1;
            mergeBubble(bubbleList, [2, 3], new LeafBubble(20));
            mergeBubble(bubbleList, [2, 3], b);
            expect(bubbleList.length).toBe(17);
        });
    });

    describe('wrap bubble', () => {
        it('wrap bubble', () => {
            wrapBubble(bubbleList, [2, 3], new InternalBubble(20, [2, 3]));

            expect(bubbleList.length).toBe(19);
        });
    });

    describe('move bubble', () => {
        it('move bubble', () => {
            moveBubble(bubbleList, 3, 1, 4);
            expect(getBubbleById(bubbleList, 3).location).toBe(1);
        });
    });

    describe('split bubble', () => {
        it('split bubble', () => {
            splitBubble(bubbleList, 4, []);
            splitBubble(bubbleList, 3, [new LeafBubble(3), new LeafBubble(4)]);
            expect(bubbleList.length).toBe(20);
        });
    });

    describe('switch bubble', () => {
        it('switch bubble', () => {
            switchBubble(bubbleList, [new SuggestBubble(1, 'hi', 1)], [new Comment(1, '', 1, 1, 1)], 3);
        });
    });

});
