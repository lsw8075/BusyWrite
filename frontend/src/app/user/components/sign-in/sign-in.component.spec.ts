import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgForm } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SignInComponent } from './sign-in.component';

@Component({
  selector: 'app-navigation',
  template: `<p>app-navigation</p>`
})
class MockNavigationComponent {

}

class MockAuthenticationService { // extends UserService ?
  public userLogin(inputVal: any): void { }
}

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockService: AuthenticationService;
  let button: HTMLButtonElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInComponent, MockNavigationComponent ],
      imports: [ FormsModule, RouterTestingModule ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SignInComponent);
      component = fixture.componentInstance;
      button = fixture.debugElement.nativeElement.querySelector('button');
      emailInput = fixture.debugElement.nativeElement.querySelector('input[type=email]');
      passwordInput = fixture.debugElement.nativeElement.querySelector('input[type=password]');
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('input fields should be empty at initalization', () => {
    expect(emailInput.value).toMatch('');
    expect(passwordInput.value).toMatch('');
  });

  it('should invoke onSubmit() method when user clicks login', async() => {
    fixture.detectChanges();
    const spy = spyOn(component, 'onSubmit');
    fixture.whenStable().then(() => {
      button.click();
    });
    fixture.whenStable().then(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  it('should not invoke userLogin() method if email is blank', async() => {
    fixture.detectChanges();
    const spy = spyOn(mockService, 'userLogin');
    const validInput = {
        email: '',
        password: 'a'
    };

    fixture.whenStable().then(() => {
      emailInput.value = validInput.email;
      passwordInput.value = validInput.password;
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
    });

    fixture.whenStable().then(() => {
      button.click();
    });

    fixture.whenStable().then(() => {
       expect(mockService.userLogin).not.toHaveBeenCalled();
    });
  });

  it('should not invoke userLogin() method if password is blank', async() => {
    fixture.detectChanges();
    const spy = spyOn(mockService, 'userLogin');
    const validInput = {
        email: 'a',
        password: ''
    };

    fixture.whenStable().then(() => {
      emailInput.value = validInput.email;
      passwordInput.value = validInput.password;
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
    });

    fixture.whenStable().then(() => {
      button.click();
    });

    fixture.whenStable().then(() => {
       expect(mockService.userLogin).not.toHaveBeenCalled();
    });
  });

  it('should invoke userLogin() method if both password or email is not blank', async() => {
    fixture.detectChanges();
    const spy = spyOn(mockService, 'userLogin');
    const validInput = {
        email: 'a',
        password: 'a'
    };

    fixture.whenStable().then(() => {
      emailInput.value = validInput.email;
      passwordInput.value = validInput.password;
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
    });

    fixture.whenStable().then(() => {
      button.click();
    });

    fixture.whenStable().then(() => {
       expect(mockService.userLogin).toHaveBeenCalled();
    });
  });

});
