import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../user/reducers/reducer';
import * as RouterAction from '../../shared/route/route-action';

@Injectable()
export class DocumentGuardService implements CanActivate {

    constructor(private _store: Store<fromUser.State>) {}

    canActivate() {
        return this._store.select(fromUser.getSignedIn);
    }
}
