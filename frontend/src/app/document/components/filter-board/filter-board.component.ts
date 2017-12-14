import { Component, OnInit, Input } from '@angular/core';

import { Board } from '../../models/board';
import { Bubble } from '../../models/bubble';

@Component({
  selector: 'app-filter-board',
  templateUrl: './filter-board.component.html',
  styleUrls: ['./filter-board.component.css']
})
export class FilterBoardComponent implements OnInit {

    @Input() BubbleList: Array<Bubble>;

    constructor() { }

    ngOnInit() {
    }

    getFilteredResults(): Array<Bubble> {
        return this.BubbleList;
    }

}
