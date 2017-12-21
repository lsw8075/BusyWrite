import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromInvitation from '../reducers/reducer';
import * as InvitationAction from '../actions/invitation-action';
import * as RouterAction from '../../shared/route/route-action';

@Component({
    selector: 'app-invitation-page',
    templateUrl: './invitation-page.component.html',
    styleUrls: ['./invitation-page.component.css']
})
export class InvitationPageComponent implements OnInit {
    constructor(private _store: Store<fromInvitation.State>) {

    }

    ngOnInit() {
        console.log('accept invitation');
        this._store.dispatch(new InvitationAction.Accept());
    }
}
