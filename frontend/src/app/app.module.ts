import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LandingAppComponent } from './landing-app/landing-app.component';
import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AlarmPageComponent } from './alarm-page/alarm-page.component';
import { DocumentDetailPageComponent } from './document-detail-page/document-detail-page.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { BrowserComponent } from './browser/browser.component';
import { SharePopupComponent } from './share-popup/share-popup.component';
import { AlarmDetailComponent } from './alarm-detail/alarm-detail.component';
import { InvitationAcceptanceComponent } from './invitation-acceptance/invitation-acceptance.component';
import { ViewBoardComponent } from './view-board/view-board.component';
import { BubbleListViewComponent } from './bubble-list-view/bubble-list-view.component';
import { BubbleHierarchyViewComponent } from './bubble-hierarchy-view/bubble-hierarchy-view.component';
import { BubbleMenuComponentComponent } from './bubble-menu-component/bubble-menu-component.component';
import { PreviewComponentComponent } from './preview-component/preview-component.component';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';
import { PreviewComponent } from './preview/preview.component';
import { EditBoardComponent } from './edit-board/edit-board.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { NoteViewComponent } from './note-view/note-view.component';
import { SangjunBoardComponent } from './sangjun-board/sangjun-board.component';
import { SuggestBubbleComponent } from './suggest-bubble/suggest-bubble.component';
import { CommentComponent } from './comment/comment.component';
import { FilterBoardComponent } from './filter-board/filter-board.component';
import { BoardManagerComponent } from './board-manager/board-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingAppComponent,
    LandingComponent,
    SigninComponent,
    MainPageComponent,
    AlarmPageComponent,
    DocumentDetailPageComponent,
    SideNavigationComponent,
    BrowserComponent,
    SharePopupComponent,
    AlarmDetailComponent,
    InvitationAcceptanceComponent,
    ViewBoardComponent,
    BubbleListViewComponent,
    BubbleHierarchyViewComponent,
    BubbleMenuComponentComponent,
    PreviewComponentComponent,
    BubbleMenuComponent,
    PreviewComponent,
    EditBoardComponent,
    EditItemComponent,
    NoteViewComponent,
    SangjunBoardComponent,
    SuggestBubbleComponent,
    CommentComponent,
    FilterBoardComponent,
    BoardManagerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
