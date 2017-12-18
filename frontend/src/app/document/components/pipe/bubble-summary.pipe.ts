import { Pipe, PipeTransform } from '@angular/core';

import { LeafBubble } from '../../models/bubble';

@Pipe({name: 'bubbleSummary'})
export class BubbleSummaryPipe implements PipeTransform {
    transform(bubble: LeafBubble): string {
        let content = bubble.content;
        content = content.replace(/<h(.)>.*?<\/h\1>/g, '');
        return content.substr(0, 20);
    }
}
