import { Component, OnInit } from '@angular/core';
import { BubbleService, BoardService } from '../document-detail-page.component';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.css']
})
export class ViewBoardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


export { BubbleService, BoardService };
