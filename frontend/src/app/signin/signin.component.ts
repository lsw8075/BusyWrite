import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  public onSubmit(f: NgForm): void {
    if (f.valid) {
      const inputValue = f.value;
      this._authenticationService.userLogin(inputValue);
    }
    console.log(f.value);
  }

}
