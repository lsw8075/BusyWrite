import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { User } from '../model/user';

@Injectable()
export class AuthenticationService implements CanActivate {

  canActivate(): boolean {
    return true;
  }
}
