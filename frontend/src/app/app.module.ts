import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';

import { LandingComponent } from './shared/components/landing/landing.component';

import { AppRoutingModule } from './shared/route/app-routing.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { DocumentStateModule } from './document/document-state.module';
import { AuthenticationStateModule } from './auth/auth-state.module';
import { AlertStateModule } from './alert/alert-state.module';
import { MainStateModule } from './file/main-state.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,

    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),

    DocumentStateModule,
    AuthenticationStateModule,
    AlertStateModule,
    MainStateModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
