import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DocumentDetailPageComponent } from './document-detail-page.component';

import { ViewBoardComponent } from './view-board/view-board.component';
import { BubbleListViewComponent } from './view-board/bubble-list-view/bubble-list-view.component';
import { BubbleMenuComponent } from './view-board/bubble-menu/bubble-menu.component';
import { PreviewComponent } from './view-board/preview/preview.component';

import { EditBoardComponent } from './edit-board/edit-board.component';
import { EditItemComponent } from './edit-board/edit-item/edit-item.component';
import { NoteViewComponent } from './edit-board/note-view/note-view.component';

import { SangjunBoardComponent } from './sangjun-board/sangjun-board.component';
import { SuggestBubbleComponent } from './sangjun-board/suggest-bubble/suggest-bubble.component';
import { CommentComponent } from './sangjun-board/comment/comment.component';

import { FilterBoardComponent } from './filter-board/filter-board.component';

import { BoardManagerComponent } from './board-manager/board-manager.component';

import { BoardService } from './service';
import { BubbleService } from './service';
import { CommentService } from './service';
import { NoteService } from './service';
import { EventBubbleService } from './service';

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
    DocumentDetailPageComponent,
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
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    CommonModule,
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
  exports: [

  ],
  providers: [
    BoardService,
    BubbleService,
    CommentService,
    NoteService,
    EventBubbleService
  ]
})
export class DocumentDetailPageModule { }
