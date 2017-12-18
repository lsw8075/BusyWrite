import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Reducers
import { InvitationReducer } from './reducers/reducer';

// Effects
import { InvitationEffects } from './effects/invitation-effect';

// Service

// Module
import { InvitationPageModule } from './components/invitation-page.module';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forFeature('invitation', InvitationReducer),
    EffectsModule.forFeature([
      InvitationEffects
    ]),
    InvitationPageModule
  ],
  declarations: [],
  exports: [
    StoreModule,
    EffectsModule,
  ],
  providers: [
  ]
})
export class InvitationStateModule { }
