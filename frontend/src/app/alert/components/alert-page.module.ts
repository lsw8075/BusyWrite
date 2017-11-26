import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertPageComponent } from './alert-page.component';
import { AlertDetailComponent } from './alert-detail/alert-detail.component';
import { InvitationAcceptanceComponent } from './invitation-acceptance/invitation-acceptance.component';

import { AlertService } from '../services/alert.service';

@NgModule({
  imports: [
    CommonModule
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
