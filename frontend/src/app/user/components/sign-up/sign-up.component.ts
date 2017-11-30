import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../../reducers/reducer';
import * as UserAction from '../../actions/user-action';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private _store: Store<fromUser.State>) { }

  ngOnInit() {
  }

  public onSubmit(f: NgForm): void {
    if (f.valid) {
      const inputValue: {name: string, username: string, password: string} = f.value;
      this._store.dispatch(new UserAction.SignUp(inputValue));
    }
    console.log(f.value);
  }

}
