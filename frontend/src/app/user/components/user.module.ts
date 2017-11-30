import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { RouterModule, Routes } from '@angular/router';

export const COMPONENTS = [
    SignInComponent,
    SignUpComponent,
];

const routes: Routes = [
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: SignUpComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: COMPONENTS
})
export class UserModule {}
