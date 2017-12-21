import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page.component';

import { FileGuardService } from '../guards/file-guard.service';

export const COMPONENTS = [
    MainPageComponent,
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
