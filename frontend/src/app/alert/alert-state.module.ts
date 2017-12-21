import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Reducers
// import { reducers } from './index';

// Effects
// import { BubbleEffects } from './effects/bubble.effect';

import { AlertPageModule } from './components/alert-page.module';

// services

import { AlertService } from './services/alert.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    // StoreModule.forFeature('alert', AlertReducer),
    // EffectsModule.forFeature([
    //   AlertEffects
    // ]),
    AlertPageModule
  ],
  declarations: [],
  exports: [
    StoreModule,
    EffectsModule,
  ],
  providers: [
    AlertService
  ]
})
export class AlertStateModule { }
