import { Component, OnInit } from '@angular/core';
import { BubbleService } from '../view-board.component';
import { Bubble, LeafBubble, InternalBubble } from '../view-board.component';
import { dragula, DragulaService } from 'ng2-dragula/ng2-dragula';
@Component({
  selector: 'app-bubble-list-view',
  templateUrl: './bubble-list-view.component.html',
  styleUrls: ['./bubble-list-view.component.css'],
  viewProviders: [ DragulaService ]
})
export class BubbleListViewComponent implements OnInit {

  bubbleRootList: Array<Bubble>; // bubbles that have root as parents

  constructor(
    private _bubbleService: BubbleService,
    private _dragulaService: DragulaService
  ) {
    _dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    _dragulaService.drop.subscribe(value => {
      const [bagName, e, el] = value;
      console.log('id is:', e.dataset.id);
      this.onDrop(value);
    });
  }

  ngOnInit() {
    this._bubbleService.getBubbleById(0).then(rootBubble => {
      this.bubbleRootList = (rootBubble as InternalBubble).childBubbleList;
      console.assert(this.bubbleRootList.length >= 0, 'bubble list cannot be negative');
    });

    const bag: any = this._dragulaService.find('bubble-bag');
    if (bag !== undefined) {
      this._dragulaService.destroy('bubble-bag');
    }
    this._dragulaService.setOptions('bubble-bag', {
      revertOnSpill: true,
      accepts: function (el, target, source, sibling) {
        return !el.contains(target);
      },
    });
  }

  private onDrag(args) {
    const [e, el] = args;
    // do something
  }

  private onDrop(args) {
    const [bagname, e, el] = args;
    console.log(this.bubbleRootList);
    console.log(bagname);
    console.log(e);
    console.log(el);
  }


  public openSangjunBoardEvent() {

  }

  public showBubbleMenuEvent() {

  }

  public showMultipleBubbleMenuEvent() {

  }

  public showBorderMenuEvent() {

  }

  public showClickableBorder() {

  }

  public splitBubble() {

  }

  public onSplitBubbleEvent() {

  }

  public onPopBubbleEvent() {

  }

  public onWrapBubbleEvent() {

  }

  public onCreateBubbleEvent() {

  }

  public onEditBubbleEvent() {

  }

  public onDeleteBubbleEvent() {

  }

}
