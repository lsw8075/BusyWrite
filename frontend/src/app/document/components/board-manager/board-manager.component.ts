import { Component, OnInit, Input } from '@angular/core';

import { Board, BoardType } from '../../models/board';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../../user/reducers/reducer';
import * as fromDocument from '../../reducers/reducer';

import * as BoardAction from '../../actions/board-action';
import * as RouterAction from '../../../shared/route/route-action';

@Component({
  selector: 'app-board-manager',
  templateUrl: './board-manager.component.html',
  styleUrls: ['./board-manager.component.css']
})
export class BoardManagerComponent implements OnInit {

    @Input() documentTitle: string;
    @Input() changeTitle: boolean;

    constructor(private _store: Store<fromDocument.State>) { }

    ngOnInit() {
        this.changeTitle = true;
    }


}
