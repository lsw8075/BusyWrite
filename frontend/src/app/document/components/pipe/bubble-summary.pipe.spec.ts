import { BubbleSummaryPipe } from './bubble-summary.pipe';
import { LeafBubble } from '../../models/bubble';

describe('BubbleSummaryPipe', () => {
    let pipe: BubbleSummaryPipe;

    beforeEach(() => {
        pipe = new BubbleSummaryPipe();
    });

    it('transforms X to Y', () => {
        const value = new LeafBubble(1, '1');
        const args: string[] = [];

        expect(pipe.transform(value)).toEqual('1');
    });

});
