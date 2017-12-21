import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { BoardType, Board } from '../../models/board';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromBoard from '../../reducers/board-reducer';
import * as fromDocument from '../../reducers/reducer';
import * as BoardAction from '../../actions/board-action';

@Directive({
  selector: '[appBoardFocus]'
})
export class BoardFocusDirective {

    @Input() appBoardFocus: Board;

  constructor(
        private _elementRef: ElementRef,
        private _store: Store<fromDocument.State>) {}

  @HostListener('document:click', ['$event'])
  clickin(event) {
    if (this._elementRef.nativeElement.contains(event.target)) {
        this._store.dispatch(new BoardAction.Select(this.appBoardFocus));
    }
  }
}
