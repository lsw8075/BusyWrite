import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

// Reducers
// import { reducers } from './index';

// Effects
// import { BubbleEffects } from './effects/bubble.effect';

import { MainPageModule } from './components/main-page.module';

// services

import { DirectoryService } from './services/directory.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    // StoreModule.forRoot(reducers),
    // EffectsModule.forRoot([
    //   BubbleEffects
    // ]),
    StoreRouterConnectingModule,
    MainPageModule
  ],
  declarations: [],
  exports: [
    StoreModule,
    EffectsModule,
  ],
  providers: [
    DirectoryService
  ]
})
export class MainStateModule { }
