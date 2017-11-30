import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AlertPageComponent } from './alert-page.component';
import { AlertDetailComponent } from './alert-detail/alert-detail.component';
import { InvitationAcceptanceComponent } from './invitation-acceptance/invitation-acceptance.component';

import { AlertService } from '../services/alert.service';

const routes: Routes = [
    {path: '', component: AlertPageComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AlertPageComponent,
    AlertDetailComponent,
    InvitationAcceptanceComponent,
  ],
  providers: [
    AlertService,
  ]
})
export class AlertPageModule { }
