import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { User } from '../model/user';

@Injectable()
export class AuthenticationService implements CanActivate {

  constructor(
    private _router: Router
  ) {}

  canActivate(): boolean {
    return true;
  }

  public userLogin(inputVal: any): void {
    this._login();
  }
  public userLogout(): Promise<void> {
    this._logout();
    return Promise.resolve(null);
  }

  private _login(): void {
    this._router.navigate(['/main']);
  }
  private _loginFail(): void {
    alert('email or password is wrong');
  }
  private _logout(): void {
   this._router.navigate(['/landing']);
  }
  private _notAllowed(): void {
    this._logout();
    alert('login is necessary to use contents');
  }
}
