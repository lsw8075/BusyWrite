import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { DocumentDetailPageModule } from './document-detail-page/document-detail-page.module';
import { AlertPageModule } from './alert-page/alert-page.module';

import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';

import { MainPageComponent } from './main-page/main-page.component';
import { SideNavigationComponent } from './main-page/side-navigation/side-navigation.component';
import { BrowserComponent } from './main-page/browser/browser.component';
import { SharePopupComponent } from './main-page/share-popup/share-popup.component';

import { AppRoutingModule } from './route/app-routing.module';

import { AuthenticationService } from './service/authentication.service';

import { DirectoryService } from './service/directory.service';
import { DocumentService } from './service/document.service';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SigninComponent,
    MainPageComponent,
    SideNavigationComponent,
    BrowserComponent,
    SharePopupComponent,
  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    DocumentDetailPageModule,
    AlertPageModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    AuthenticationService,
    DirectoryService,
    DocumentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
