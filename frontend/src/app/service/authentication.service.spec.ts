import { async, inject, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {

  beforeEach((() => {
    let mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: Router, userValue: mockRouter },
      ]
    });
  }));

  it('can instantiate service when injecting service',
  inject([AuthenticationService, Router], (service: AuthenticationService) => {
    expect(service instanceof AuthenticationService).toBe(true);
  }));

  it('can activate',
  inject([AuthenticationService, Router], (service: AuthenticationService) => {
    expect(service.canActivate()).toBe(true);
  }));

});
