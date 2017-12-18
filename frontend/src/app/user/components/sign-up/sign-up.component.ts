import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../reducers/reducer';
import * as UserAction from '../../actions/user-action';

import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

    constructor(
        private _store: Store<fromUser.State>,
        public _snackBar: MatSnackBar) {
            this._store.select(fromUser.getUserError).subscribe(err => {
                if (err) {
                    this.showErrorMsg(err);
                    this._store.dispatch(new UserAction.ClearError());
                }
            });
        }

    ngOnInit() {
    }

    public onSubmit(f: NgForm): void {
        if (f.valid) {
        const inputValue: {email: string, password: string} = f.value;
        this._store.dispatch(new UserAction.SignUp(inputValue));
        }
        console.log(f.value);
    }
    showErrorMsg(err: string): void {
        this._snackBar.open('Error!' , err, {
            duration: 2000
        });
    }

}
