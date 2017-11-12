import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from '../signin/signin.component';
import { LandingComponent } from '../landing/landing.component';
import { AlarmPageComponent } from '../alarm-page/alarm-page.component';
import { DocumentDetailPageComponent } from '../document-detail-page/document-detail-page.component';
import { MainPageComponent } from '../main-page/main-page.component';

import { AuthenticationService } from '../service/authentication.service';

const routes = [
  { path: '', redirectTo: '/document/1', pathMatch: 'full' }, // for easy testing, temporary
  { path: 'landing', component: LandingComponent },
  { path: 'sign_in',  component: SigninComponent },
  {
    path: 'alarm',
    component: AlarmPageComponent,
    canActivate: [ AuthenticationService ],
  },
  {
    path: 'document/:id',
    component: DocumentDetailPageComponent,
    canActivate: [ AuthenticationService ],
  },
  {
    path: 'main',
    component: MainPageComponent,
    canActivate: [ AuthenticationService ],
  },
  {
    path: '**',
    component: LandingComponent,
    canActivate: [ AuthenticationService ],
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
