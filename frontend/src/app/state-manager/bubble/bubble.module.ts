import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// import { ComponentsModule } from './components';
// import { BookEffects } from './effects/book';
// import { CollectionEffects } from './effects/collection';
// import { BookExistsGuard } from './guards/book-exists';

import { BubbleReducer } from './reducers/bubble.reducer';
import { BubbleComponentModule } from './components/bubble-component.module';
import { BubbleEffects } from './effects/bubble.effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('bubble', BubbleReducer),
    BubbleComponentModule,
    EffectsModule.forFeature([BubbleEffects]),
  ],
  declarations: [

  ],
  // providers: [BookExistsGuard],
})
export class BubbleModule {}
