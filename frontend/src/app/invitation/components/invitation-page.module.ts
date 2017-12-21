import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { InvitationPageComponent } from './invitation-page.component';

export const COMPONENTS = [
    InvitationPageComponent,
];

const routes: Routes = [
    {path: ':hash', component: InvitationPageComponent},
    // {path: '', redirectTo: 'users/signin', pathMatch: 'full'},
    // {path: '**', redirectTo: 'users/signin'}
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CommonModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: []
})
export class InvitationPageModule { }
