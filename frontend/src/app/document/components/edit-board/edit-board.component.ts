import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Note, NoteService, BoardService } from './service';
import { EventBubbleService } from './service';

import { Board } from '../../models/board';
import { LeafBubble, Bubble, BubbleType, SuggestBubble } from '../../models/bubble';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDocument from '../../reducers/reducer';
import * as fromBubble from '../../reducers/bubble-reducer';
import * as BubbleAction from '../../actions/bubble-action';
import * as SangjunBoardAction from '../../actions/sangjun-bubble-action';
import * as EditBoardAction from '../../actions/edit-board-action';
import * as _ from 'lodash';

@Component({
    selector: 'app-edit-board',
    templateUrl: './edit-board.component.html',
    styleUrls: ['./edit-board.component.css', '../board-style.css']
})

export class EditBoardComponent implements OnInit, OnDestroy {

    notes$: Observable<Array<Note>>;
    editSuggests: Array<{isBindSuggest: boolean, bindBubbleId: number, content: string}>;
    editBubbles: Array<Bubble>;
    editBubbleId: number;
    editBubbleString: string;
    updateString: string;
    loading: boolean;
    isEditting: boolean = false;

    constructor(
        private _store: Store<fromDocument.State>,
        private _noteService: NoteService,
        private _boardService: BoardService,
        private _eventBubbleService: EventBubbleService) {
        this._store.select(fromDocument.getEditBubbles).subscribe((editBubbles) => {
            if (! this.isEditting) {
                this.editBubbles = _.cloneDeep(editBubbles);
                console.log(editBubbles);
            }
        });
        this._store.select(fromDocument.getBubbleState).subscribe((bubbleState) => {
            // this.editSuggests = editSuggests;
            this.editBubbleId = bubbleState.editBubbleId;
            this.editBubbleString = bubbleState.editBubbleString;
            this.loading = bubbleState.loading;
        });
    }

    ngOnInit() {
    }

    public finishEditBubble(bubble: Bubble) {
        this.isEditting = false;
        this._store.dispatch(new BubbleAction.EditComplete({ bubbleId: bubble.id, content: this.updateString }));
    }

    public discardEditBubble(bubble: Bubble) {
        this.isEditting = false;
        this._store.dispatch(new BubbleAction.EditDiscard(bubble.id));
    }

    public focusEditBubble(bubble: Bubble, focused: boolean) {
        console.log(bubble.id, focused);
        if (focused) {
            this.isEditting = true;
            const content = (bubble as LeafBubble).content;
            this._store.dispatch(new BubbleAction.EditUpdateResume({bubbleId: bubble.id, content: content}));
        } else {
            this.isEditting = false;
        }
    }

    public updateEditBubble(bubble: Bubble, updateString: string) {
        this.updateString = updateString;
        if (this.loading === false && this.editBubbleId === bubble.id) {
            if (updateString !== this.editBubbleString) {
                console.log(bubble.id, updateString, this.editBubbleString);
                this._store.dispatch(new BubbleAction.EditUpdate({bubbleId: bubble.id, content: updateString}));
            }
        }
    }

    public finishEditSuggest(suggest: {isBindSuggest: boolean, bindBubbleId: number, content: string}) {
        if (suggest.isBindSuggest) {
            console.log('edit suggest bubble');
            this._store.dispatch(new BubbleAction.EditSuggest({ bindSuggestBubbleId: suggest.bindBubbleId, content: suggest.content }));
        } else {
            console.log('create suggest bubble');
            this._store.dispatch(new BubbleAction.CreateSuggest({ bindBubbleId: suggest.bindBubbleId, content: suggest.content }));
        }
        // this.isEditting = false;
        // this._store.dispatch(new BubbleAction.EditComplete({ bubbleId: bubble.id, content: this.updateString }));
    }

    public discardEditSuggest(suggest: {isBindSuggest: boolean, bindBubbleId: number, content: string}) {
        console.log('discardEditSuggest');
        // this.isEditting = false;
        // this._store.dispatch(new BubbleAction.EditDiscard(bubble.id));
    }

    public focusEditSuggest(suggest: {isBindSuggest: boolean, bindBubbleId: number, content: string}, focused: boolean) {
        console.log(suggest, focused);
        // if (focused) {
        //     this.isEditting = true;
        //     const content = (bubble as LeafBubble).content;
        //     this._store.dispatch(new BubbleAction.EditUpdateResume({bubbleId: bubble.id, content: content}));
        // } else {
        //     this.isEditting = false;
        // }
    }

    public updateEditSuggest(suggest: {isBindSuggest: boolean, bindBubbleId: number, content: string}, updateString: string) {
        console.log(suggest, updateString);
    }


    public createNewEditItem(bubble: Bubble) {
    // this.editItems.push(editItem);
    // console.log('new item');
    }

    addNote() {
    // this._noteService.addNote()
    //   .then(note => {
    //     this.notes.push(note);
    //   });
    }

    deleteNote(note: Note) {
    // this._noteService.deleteNote(note)
    //   .then(response => {
    //     this.notes = this.notes.filter(n => n.id !== note.id);
    //   });
    }

    updateNote(note: Note) {
    // this._noteService.updateNote(note).then(response => {
    //   console.log('note changed!');
    // });
    }

    ngOnDestroy() {

    }

    public toComment(note: Note) {
        console.log('tocomment');
    }

    public toBubble(note: Note) {

    }


}

export { Note };
