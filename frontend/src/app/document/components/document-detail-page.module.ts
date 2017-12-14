import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

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

import { SplitBubbleComponent } from './view-board/split-bubble/split-bubble.component';

import { ClickOutsideDirective } from './directive/click-outside.directive';
import { InternalBubbleDirective } from './directive/internal-bubble.directive';
import { LeafBubbleDirective } from './directive/leaf-bubble.directive';
import { StopClickPropagationDirective } from './directive/stop-click-propagation.directive';
import { StopHoverPropagationDirective } from './directive/stop-hover-propagation.directive';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { QuillEditorModule } from 'ngx-quill-editor';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { ButtonModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';

import { CovalentLayoutModule, CovalentExpansionPanelModule, CovalentChipsModule } from '@covalent/core';

import { MatListModule, MatIconModule, MatInputModule } from '@angular/material';

const routes: Routes = [
    {path: '', component: DocumentDetailPageComponent},
];

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
    SplitBubbleComponent,

    ClickOutsideDirective,
    InternalBubbleDirective,
    LeafBubbleDirective,
    StopClickPropagationDirective,
    StopHoverPropagationDirective,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    TabsModule.forRoot(),
    TabViewModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    ButtonModule,
    DragulaModule,
    DialogModule,
    EditorModule,
    QuillEditorModule,
    DialogModule,
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),

    CovalentLayoutModule, CovalentExpansionPanelModule,

    MatListModule, MatIconModule, MatInputModule, CovalentChipsModule
  ],
  exports: [
    DocumentDetailPageComponent
  ],
  providers: [],
  entryComponents: [SplitBubbleComponent]
})
export class DocumentDetailPageModule { }
