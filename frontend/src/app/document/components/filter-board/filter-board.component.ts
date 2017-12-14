import { Component, OnInit, Input } from '@angular/core';

import { Board } from '../../models/board';

@Component({
  selector: 'app-filter-board',
  templateUrl: './filter-board.component.html',
  styleUrls: ['./filter-board.component.css']
})
export class FilterBoardComponent implements OnInit {

    @Input() board: Board;

  constructor() { }

  ngOnInit() {
  }

}
