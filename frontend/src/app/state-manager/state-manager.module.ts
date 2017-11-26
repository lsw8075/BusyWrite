import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

// Reducers
import { reducers } from './index';

// Effects
import { BubbleEffects } from './bubble/effects/bubble.effect';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      BubbleEffects
    ]),
    StoreRouterConnectingModule,
  ],
  declarations: [],
  exports: [
    StoreModule,
    // EffectsModule,
  ],
})
export class StateManagerModule { }
