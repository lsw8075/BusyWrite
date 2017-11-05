import { Component, OnInit } from '@angular/core';
import { MenuType } from '../view-board.component';

@Component({
  selector: 'app-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.css']
})
export class BubbleMenuComponent implements OnInit {

  menuType: MenuType;

  constructor() { }

  ngOnInit() {
  }

  public test() {
    console.log('test is ok');
  }

  public openSangjunBoardEvent() {

  }

  public splitBubbleEvent() {

  }

  public popBubbleEvent() {


  }

  public wrapBubbleEvent() {

  }

  public createBubbleEvent() {

  }

  public editBubbleEvent() {


  }

  public deleteBubbleEvent() {

  }



}
