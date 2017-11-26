import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MainPageComponent } from './main-page.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { BrowserComponent } from './browser/browser.component';
import { SharePopupComponent } from './share-popup/share-popup.component';

@NgModule({
  declarations: [
    MainPageComponent,
    SideNavigationComponent,
    BrowserComponent,
    SharePopupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    CommonModule,
  ],
  exports: [

  ],
  providers: []
})
export class MainPageModule { }
