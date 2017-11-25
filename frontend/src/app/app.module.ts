import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { DocumentDetailPageModule } from './document-detail-page/document-detail-page.module';

import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';

import { AlertPageComponent } from './alert-page/alert-page.component';
import { AlertDetailComponent } from './alert-page/alert-detail/alert-detail.component';
import { InvitationAcceptanceComponent } from './alert-page/invitation-acceptance/invitation-acceptance.component';

import { MainPageComponent } from './main-page/main-page.component';
import { SideNavigationComponent } from './main-page/side-navigation/side-navigation.component';
import { BrowserComponent } from './main-page/browser/browser.component';
import { SharePopupComponent } from './main-page/share-popup/share-popup.component';

import { AppRoutingModule } from './route/app-routing.module';

import { AlertService } from './service/alert.service';
import { AuthenticationService } from './service/authentication.service';

import { DirectoryService } from './service/directory.service';
import { DocumentService } from './service/document.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SigninComponent,
    MainPageComponent,
    AlertPageComponent,
    SideNavigationComponent,
    BrowserComponent,
    SharePopupComponent,
    AlertDetailComponent,
    InvitationAcceptanceComponent,
  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    DocumentDetailPageModule,
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    AlertService,
    AuthenticationService,
    DirectoryService,
    DocumentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
