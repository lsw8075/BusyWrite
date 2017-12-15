import { Component, OnInit, Input } from '@angular/core';

import { Board } from '../../models/board';
import { Bubble, BubbleType, LeafBubble } from '../../models/bubble';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-board',
  templateUrl: './filter-board.component.html',
  styleUrls: ['./filter-board.component.css']
})
export class FilterBoardComponent implements OnInit {

    @Input() bubbleList: Array<Bubble>;
    searchKeyword = '';

    constructor() { }

    ngOnInit() {
    }

    getFilteredResults(): Array<string> {
        console.log('searching');
        return this.bubbleList.filter(b => b.type === BubbleType.leafBubble)
            .map(b => (b as LeafBubble).content)
            .filter(content => content.indexOf(this.searchKeyword) !== -1)
            .map(result =>
                result.split(this.searchKeyword).join(`<mark>${this.searchKeyword}</mark>`));

    }

}
