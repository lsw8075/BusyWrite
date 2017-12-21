import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Note, NoteService, BoardService } from './service';
import { EventBubbleService } from './service';

import { Board } from '../../models/board';
import { LeafBubble, Bubble, BubbleType, SuggestBubble, Suggest } from '../../models/bubble';

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

    @Input() notes: Array<Note>;
    editSuggests: Array<Suggest>;
    editBubbles: Array<Bubble>;
    editBubbleId: number;
    editBubbleString: string;
    updateBubbleId: number;
    updateString: string;
    updateId: number;
    loading: boolean;

    editActiveBubbleIds: Array<number>;

    isFocused = false;
    focusedId: number;

    constructor(
        private _store: Store<fromDocument.State>,
        private _noteService: NoteService,
        private _boardService: BoardService,
        private _eventBubbleService: EventBubbleService) {
        this._store.select(fromDocument.getEditBubbles).subscribe((editBubbles) => {
            if (! this.isFocused) {
                this.editBubbles = _.cloneDeep(editBubbles);
    //            console.log(editBubbles);
            }
        });
        this._store.select(fromDocument.getBubbleState).subscribe((bubbleState) => {
            this.editSuggests = bubbleState.editSuggests;
            this.editBubbleId = bubbleState.editBubbleId;
            this.editBubbleString = bubbleState.editBubbleString;
            this.loading = bubbleState.loading;
            this.editActiveBubbleIds = bubbleState.editActiveBubbleIds;
        });
    }

    ngOnInit() {
    }

    public isEditBubbleOpen(bubble: Bubble): boolean {
        return this.editActiveBubbleIds.includes(bubble.id);
    }

    public toggleIsOpen(bubble: Bubble): void {
        if (this.isEditBubbleOpen(bubble)) {
            this._store.dispatch(new BubbleAction.EditBubbleClose(bubble));
        } else {
            this._store.dispatch(new BubbleAction.EditBubbleOpen(bubble));
        }
    }

    public toggleEditBubble(bubble: Bubble, event): void {
        if (this.isEditBubbleOpen(bubble)) {
            this._store.dispatch(new BubbleAction.EditBubbleClose(bubble));
        } else {
            this._store.dispatch(new BubbleAction.EditBubbleOpen(bubble));
        }

    }

    public finishEditBubble(bubble: Bubble) {
        this.isFocused = false;
        if (bubble.id === this.updateId) {
            this._store.dispatch(new BubbleAction.EditComplete({ bubbleId: bubble.id, content: this.updateString }));
        } else {
            this._store.dispatch(new BubbleAction.EditComplete({ bubbleId: bubble.id, content: (bubble as LeafBubble).content }));
        }
    }

    public discardEditBubble(bubble: Bubble) {
        this.isFocused = false;
        this._store.dispatch(new BubbleAction.EditDiscard(bubble.id));
    }

    public focusEditBubble(bubble: Bubble, focused: boolean) {
        console.log(bubble.id, focused);
        if (focused) {
            this.isFocused = true;
            this.focusedId = bubble.id;
            const content = (bubble as LeafBubble).content;
            this._store.dispatch(new BubbleAction.EditUpdateResume({bubbleId: bubble.id, content: content}));
        } else if (this.focusedId === bubble.id) {
            this.isFocused = false;
        }
    }

    public updateEditBubble(bubble: Bubble, updateString: string) {
        this.updateString = updateString;
        this.updateId = bubble.id;
        (bubble as LeafBubble).content = updateString;
        if (this.loading === false && this.editBubbleId === bubble.id) {
            if (updateString !== this.editBubbleString) {
                console.log(bubble.id, updateString, this.editBubbleString);
                this._store.dispatch(new BubbleAction.EditUpdate({bubbleId: bubble.id, content: updateString}));
            }
        }
    }

    updateSuggestString: string;
    updateSuggest: Suggest;
    public finishEditSuggest(suggest: Suggest) {
        suggest.content = (suggest === this.updateSuggest) ? this.updateSuggestString : suggest.content;
            console.log(suggest.content);
        this._store.dispatch(new BubbleAction.EditSuggestFinish(suggest));
    }

    public discardEditSuggest(suggest: Suggest) {
        this._store.dispatch(new BubbleAction.EditSuggestDiscard(suggest));
    }

    public focusEditSuggest(suggest: Suggest, focused: boolean) {
    }

    public updateEditSuggest(suggest: Suggest, updateString: string) {
        this.updateSuggestString = updateString;
        this.updateSuggest = suggest;
        suggest.content = this.updateSuggestString;

    }

    deleteNote(note: Note) {
        console.log('delete note', note);
        // this._store.dispatch(new BubbleAction.NoteDelete(note));
    }

    updateNote(note: Note) {
        // this._store.dispatch(new BubbleAction.NoteEdit(note));
    }

    ngOnDestroy() {
        // this.notes.forEach(note => this._store.dispatch(new BubbleAction.NoteEdit(note)));
    }

    public toComment(note: Note) {
        console.log('tocomment');
    }

    public toBubble(note: Note) {
        this._store.dispatch(new BubbleAction.ExportNoteAsBubble(note));
    }


}

export { Note };
