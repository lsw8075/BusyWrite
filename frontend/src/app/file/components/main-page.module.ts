import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { BrowserComponent } from './browser/browser.component';
import { SharePopupComponent } from './share-popup/share-popup.component';

import { FileGuardService } from '../guards/file-guard.service';

export const COMPONENTS = [
    MainPageComponent,
    SideNavigationComponent,
    BrowserComponent,
    SharePopupComponent,
];

const routes: Routes = [
    {path: '', component: MainPageComponent, canActivate: [FileGuardService]},
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
export class MainPageModule { }
