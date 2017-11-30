import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../reducers/reducer';
import * as UserAction from '../../actions/user-action';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private _store: Store<fromUser.State>) { }

  ngOnInit() {}

  public onSubmit(f: NgForm): void {
    if (f.valid) {
      const inputValue: {username: string, password: string} = f.value;
      this._store.dispatch(new UserAction.SignIn(inputValue));
    }
    console.log(f.value);
  }

  public signup(): void {
    this._store.dispatch(new UserAction.RedirectSignUp());
  }

} /* istanbul ignore next */
