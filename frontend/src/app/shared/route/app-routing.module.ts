import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from '../../auth/components/signin/signin.component';
import { LandingComponent } from '../components/landing/landing.component';
import { AlertPageComponent } from '../../alert/components/alert-page.component';
import { DocumentDetailPageComponent } from '../../document/components/document-detail-page.component';
import { MainPageComponent } from '../../file/components/main-page.component';

const routes = [
  { path: '', redirectTo: '/document/1', pathMatch: 'full' }, // for easy testing, temporary
  { path: 'landing', component: LandingComponent },
  { path: 'sign_in',  component: SigninComponent },
  {
    path: 'alert',
    component: AlertPageComponent,
  },
  {
    path: 'document/:id',
    component: DocumentDetailPageComponent,
  },
  {
    path: 'main',
    component: MainPageComponent,
  },
  {
    path: '**',
    component: LandingComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
