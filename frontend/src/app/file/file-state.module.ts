import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Reducers
import { FileReducer } from './reducers/reducer';

// Effects
import { FileEffects } from './effects/file-effect';

// Service
import { DirectoryService } from './services/directory.service';

// Module
import { MainPageModule } from './components/main-page.module';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forFeature('file', FileReducer),
    EffectsModule.forFeature([
      FileEffects
    ]),
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
export class FileStateModule { }
