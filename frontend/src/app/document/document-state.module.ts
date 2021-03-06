import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

// Reducers
import { reducer } from './reducers/reducer';

// Effects
import { BubbleEffects } from './effects/bubble-effect';


// Module
import { DocumentDetailPageModule } from './components/document-detail-page.module';

// services

import { BoardService } from './services/board.service';
import { BubbleService } from './services/bubble.service';
import { CommentService } from './services/comment.service';
import { NoteService } from './services/note.service';
import { EventBubbleService } from './services/event/event-bubble.service';
import { DocumentService } from './services/document.service';
import { WebSocketService } from 'angular2-websocket-service';
import { ServerSocket } from './services/websocket.service';

// guards

import { DocumentGuardService } from './guards/document-guard.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forFeature('document', reducer),
    EffectsModule.forFeature([
      BubbleEffects
    ]),
    DocumentDetailPageModule
  ],
  declarations: [],
  exports: [
    StoreModule,
    EffectsModule,
  ],
  providers: [
    BoardService,
    BubbleService,
    CommentService,
    NoteService,
    EventBubbleService,
    DocumentService,
    WebSocketService,
    ServerSocket,
    DocumentGuardService
  ]
})
export class DocumentStateModule { }
