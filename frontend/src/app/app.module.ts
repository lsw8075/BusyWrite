import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';

import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';

import { AlertPageComponent } from './alert-page/alert-page.component';
import { AlertDetailComponent } from './alert-page/alert-detail/alert-detail.component';
import { InvitationAcceptanceComponent } from './alert-page/invitation-acceptance/invitation-acceptance.component';

import { MainPageComponent } from './main-page/main-page.component';
import { SideNavigationComponent } from './main-page/side-navigation/side-navigation.component';
import { BrowserComponent } from './main-page/browser/browser.component';
import { SharePopupComponent } from './main-page/share-popup/share-popup.component';

import { DocumentDetailPageComponent } from './document-detail-page/document-detail-page.component';

import { ViewBoardComponent } from './document-detail-page/view-board/view-board.component';
import { BubbleListViewComponent } from './document-detail-page/view-board/bubble-list-view/bubble-list-view.component';
import { BubbleMenuComponent } from './document-detail-page/view-board/bubble-menu/bubble-menu.component';
import { PreviewComponent } from './document-detail-page/view-board/preview/preview.component';

import { EditBoardComponent } from './document-detail-page/edit-board/edit-board.component';
import { EditItemComponent } from './document-detail-page/edit-board/edit-item/edit-item.component';
import { NoteViewComponent } from './document-detail-page/edit-board/note-view/note-view.component';

import { SangjunBoardComponent } from './document-detail-page/sangjun-board/sangjun-board.component';
import { SuggestBubbleComponent } from './document-detail-page/sangjun-board/suggest-bubble/suggest-bubble.component';
import { CommentComponent } from './document-detail-page/sangjun-board/comment/comment.component';

import { FilterBoardComponent } from './document-detail-page/filter-board/filter-board.component';

import { BoardManagerComponent } from './document-detail-page/board-manager/board-manager.component';

import { AppRoutingModule } from './route/app-routing.module';

import { AlertService } from './service/alert.service';
import { AuthenticationService } from './service/authentication.service';
import { BoardService } from './service/board.service';
import { BubbleService } from './service/bubble.service';
import { CommentService } from './service/comment.service';
import { DirectoryService } from './service/directory.service';
import { DocumentService } from './service/document.service';
import { NoteService } from './service/note.service';
import { WebsocketService, WebsocketInternalService } from './service/websocket.service';

import { EventBubbleService } from './service/event/event-bubble.service';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { QuillEditorModule } from 'ngx-quill-editor';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { TabViewModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';

import { EditorModule } from 'primeng/primeng';

import { DialogModule } from 'primeng/primeng';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SigninComponent,
    MainPageComponent,
    AlertPageComponent,
    DocumentDetailPageComponent,
    SideNavigationComponent,
    BrowserComponent,
    SharePopupComponent,
    AlertDetailComponent,
    InvitationAcceptanceComponent,
    ViewBoardComponent,
    BubbleListViewComponent,
    BubbleMenuComponent,
    PreviewComponent,
    EditBoardComponent,
    EditItemComponent,
    NoteViewComponent,
    SangjunBoardComponent,
    SuggestBubbleComponent,
    CommentComponent,
    FilterBoardComponent,
    BoardManagerComponent,
  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    TabViewModule,
    BsDropdownModule.forRoot(),
    ButtonModule,
    DragulaModule,
    DialogModule,
    EditorModule,
    QuillEditorModule,
    DialogModule,
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    AlertService,
    AuthenticationService,
    BoardService,
    BubbleService,
    CommentService,
    DirectoryService,
    DocumentService,
    EventBubbleService,
    NoteService,
    WebsocketService,
    WebsocketInternalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
