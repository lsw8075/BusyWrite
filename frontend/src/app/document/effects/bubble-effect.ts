import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/withLatestFrom';

import * as BubbleAction from '../actions/bubble-action';
import * as EditBoardAction from '../actions/edit-board-action';
import * as RouteAction from '../../shared/route/route-action';

import * as fromDocument from '../reducers/reducer';
import { Bubble, BubbleType, InternalBubble, LeafBubble, SuggestBubble } from '../models/bubble';
import { Comment } from '../models/comment';
import { Note } from '../models/note';
import { User } from '../../user/models/user';
import { MenuType } from '../services/event/event-bubble.service';
import { ViewBoardMenuType } from '../reducers/bubble-reducer';


import { BubbleService } from '../services/bubble.service';
import {
    getBubbleById,
    getParentBubble,
    isBubbleInList,
    mouseOverBubble,
    deleteBubble, popBubble, getContent, flattenBubble, createBubble,
    editBubble, mergeBubble, wrapBubble, moveBubble, splitBubble} from '../reducers/bubble-operation';

@Injectable()
export class BubbleEffects {

    private tokenUrl = '/api/token';

    @Effect()
    changeTitle$: Observable<Action> = this.action$.ofType<BubbleAction.ChangeTitle>(BubbleAction.CHANGE_TITLE)
        .map(action => action.payload).mergeMap(query => {
            this.bubbleService.changeTitle(query);
            return Observable.of(new BubbleAction.ChangeTitlePending(null));
        });

    @Effect({dispatch: true})
    open$: Observable<Action> = this.action$.ofType<BubbleAction.Open>(BubbleAction.OPEN)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const routerState = (state as any).router.state;
            this.bubbleService.openDocument(routerState.params.id);
            return Observable.of(new BubbleAction.OpenPending(null));
        });

    @Effect()
    openComplete$: Observable<Action> = this.action$.ofType<BubbleAction.OpenComplete>(BubbleAction.OPEN_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.Load(query.documentObject.id));
        });

    @Effect()
    close$: Observable<Action> = this.action$.ofType<BubbleAction.Close>(BubbleAction.CLOSE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const documentId = bubbleState.documentId;
            return Observable.of(this.bubbleService.closeDocument(documentId))
                .map(() => new BubbleAction.ClosePending(null));
        });

    @Effect()
    closeComplete$: Observable<Action> = this.action$.ofType<BubbleAction.CloseComplete>(BubbleAction.CLOSE_COMPLETE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const route = bubbleState.routeAfterClose;
            return Observable.of(new RouteAction.GoByUrl(route));
        });

    @Effect()
    load$: Observable<Action> = this.action$.ofType<BubbleAction.Load>(BubbleAction.LOAD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.getWholeDocument())
                .map(() => new BubbleAction.LoadPending(null));
        });

    // @Effect()
    // loadComplete$: Observable<Action> = this.action$.ofType<BubbleAction.LoadComplete>(BubbleAction.LOAD_COMPLETE)
    //     .map(action => action.payload).mergeMap(query => {
    //         return Observable.of(this.bubbleService.createCommentOnSuggestBubble(2115, "eiruiw" ))
    //             .map(() => new BubbleAction.LoadPending(null));
    //     });

    @Effect()
    pop$: Observable<Action> = this.action$.ofType<BubbleAction.PopBubble>(BubbleAction.POP_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.popBubble(query))
                .map(() => new BubbleAction.PopBubblePending(null));
        });

    @Effect()
    delete$: Observable<Action> = this.action$.ofType<BubbleAction.DeleteBubble>(BubbleAction.DELETE_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.deleteBubble(query))
                .map(() => new BubbleAction.DeleteBubblePending(null));
        });

    @Effect()
    create$: Observable<Action> = this.action$.ofType<BubbleAction.CreateBubble>(BubbleAction.CREATE_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const bubbleList = bubbleState.bubbleList;
            const bubble = getBubbleById(bubbleList, action.payload.bubbleId);
            const parentBubble = getParentBubble(bubbleList, bubble);
            let loc = bubble.location;
            if (! action.payload.isAbove) {
                loc++;
            }
            return Observable.of(this.bubbleService.createBubble(parentBubble.id, loc, 'new empty'))
                .map(() => new BubbleAction.CreateBubblePending(null));
        });

    @Effect()
    createComplete$: Observable<Action> = this.action$.ofType<BubbleAction.CreateBubbleComplete>(BubbleAction.CREATE_BUBBLE_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.EditRequestSuccess({bubbleId: query.id, userId: (query as LeafBubble).editLockHolder}));
        });

    @Effect()
    createSuggest$: Observable<Action> = this.action$.ofType<BubbleAction.CreateSuggest>(BubbleAction.CREATE_SUGGEST)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.createSuggestBubble(query))
                .map(() => new BubbleAction.CreateSuggestPending(null));
        });

    @Effect({dispatch: false})
    editRequestSuccess$: Observable<Action> = this.action$.ofType<BubbleAction.EditRequestSuccess>(BubbleAction.EDIT_REQUEST_SUCCESS)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            return Observable.of();
        });

    @Effect()
    editUpdate$: Observable<Action> = this.action$.ofType<BubbleAction.EditUpdate>(BubbleAction.EDIT_UPDATE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.updateEdittingBubble(query.bubbleId, query.content))
                .map(() => new BubbleAction.EditUpdatePending(null));
        });

    @Effect()
    editComplete: Observable<Action> = this.action$.ofType<BubbleAction.EditComplete>(BubbleAction.EDIT_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.finishEdittingBubble(query.bubbleId, query.content))
                .map(() => new BubbleAction.EditCompletePending(null));
        });

    @Effect()
    editDiscard: Observable<Action> = this.action$.ofType<BubbleAction.EditDiscard>(BubbleAction.EDIT_DISCARD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.discardEdittingBubble(query))
                .map(() => new BubbleAction.EditDiscardPending(null));
        });

    @Effect()
    edit$: Observable<Action> = this.action$.ofType<BubbleAction.EditBubble>(BubbleAction.EDIT_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.startEdittingBubble(query))
                .map(() => new BubbleAction.EditBubblePending(null));
        });

    @Effect()
    editSuggestFinish$: Observable<Action> = this.action$.ofType<BubbleAction.EditSuggestFinish>(BubbleAction.EDIT_SUGGEST_FINISH)
        .map(action => action.payload).mergeMap(query => {
            if (query.isBindSuggest) {
                console.log('EditSuggest', query);
                return Observable.of(new BubbleAction.EditSuggest(query));
            } else {
                console.log('CreateSuggest', query);
                return Observable.of(new BubbleAction.CreateSuggest(query));
            }
        });

    @Effect()
    editSuggestDiscard$: Observable<Action> = this.action$.ofType<BubbleAction.EditSuggestDiscard>(BubbleAction.EDIT_SUGGEST_DISCARD)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(new BubbleAction.EditSuggestDiscardComplete(query));
        });

    @Effect({dispatch: false})
    editSuggestDiscardComplete$: Observable<Action> = this.action$.ofType<BubbleAction.EditSuggestDiscardComplete>(BubbleAction.EDIT_SUGGEST_DISCARD_COMPLETE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of();
        });

    @Effect()
    editSuggest$: Observable<Action> = this.action$.ofType<BubbleAction.EditSuggest>(BubbleAction.EDIT_SUGGEST)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.editSuggestBubble(query))
                .map(() => new BubbleAction.EditSuggestPending(null));
        });

    @Effect()
    wrap$: Observable<Action> = this.action$.ofType<BubbleAction.WrapBubble>(BubbleAction.WRAP_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const wrapBubbleList = bubbleState.selectedBubbleList.map(b => b.id);
            return Observable.of(this.bubbleService.wrapBubble(wrapBubbleList))
                .map(() => new BubbleAction.WrapBubblePending(null));
        });

    @Effect()
    merge$: Observable<Action> = this.action$.ofType<BubbleAction.MergeBubble>(BubbleAction.MERGE_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            console.log(state);
            const bubbleState = (state as any).document.bubble;
            const mergeBubbleList = bubbleState.selectedBubbleList.map(b => b.id);
            return Observable.of(this.bubbleService.mergeBubble(mergeBubbleList))
                .map(() => new BubbleAction.MergeBubblePending(null));
        });

    @Effect()
    select$: Observable<Action> = this.action$.ofType<BubbleAction.Select>(BubbleAction.SELECT)
        .withLatestFrom(this._store).filter(([action, state]) =>
            ((state as any).document.bubble.viewBoardMenuType === ViewBoardMenuType.move &&
            (action.payload.menu === MenuType.borderTopMenu ||
                action.payload.menu === MenuType.borderBottomMenu)))
        .mergeMap(([action, state]) => {
            console.log('moving start', state);
            const bubbleState = (state as any).document.bubble;
            const selectedBubbleList = bubbleState.selectedBubbleList;
            const selectedMenuType = action.payload.menu;
            const bubbleId = selectedBubbleList[0].id;
            const destBubbleId = action.payload.bubble.id;
            console.log((action.payload.bubble));
            const isAbove = selectedMenuType === MenuType.borderTopMenu;
            return Observable.of(new BubbleAction.MoveBubble({
                bubbleId, destBubbleId, isAbove
            }));
        });

    @Effect()
    split$: Observable<Action> = this.action$.ofType<BubbleAction.SplitLeaf>(BubbleAction.SPLIT_LEAF)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.splitLeafBubble(query.bubbleId, query.contentList))
                .map(() => new BubbleAction.SplitLeafPending(null));
        });

    @Effect()
    flatten$: Observable<Action> = this.action$.ofType<BubbleAction.FlattenBubble>(BubbleAction.FLATTEN_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.flattenBubble(query))
                .map(() => new BubbleAction.FlattenBubblePending(null));
        });

    @Effect()
    move$: Observable<Action> = this.action$.ofType<BubbleAction.MoveBubble>(BubbleAction.MOVE_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const bubbleList = bubbleState.bubbleList;

            const bubble = getBubbleById(bubbleList, action.payload.bubbleId);
            const parentBubble = getParentBubble(bubbleList, bubble);

            const destBubble = getBubbleById(bubbleList, action.payload.destBubbleId);
            const destParentBubble = getParentBubble(bubbleList, destBubble);

            let location = destBubble.location;
            if (parentBubble.id === destParentBubble.id && bubble.location < destBubble.location) {
                location--;
            }
            if (! action.payload.isAbove) {
                location++;
            }
            return Observable.of(this.bubbleService.moveBubble(bubble.id, destParentBubble.id, location))
                .map(() => new BubbleAction.MoveBubblePending(null));
        });

    @Effect()
    addContributerRequest$: Observable<Action> =
    this.action$.ofType<BubbleAction.AddContributerRequest>(BubbleAction.ADD_CONTRIBUTER_REQUEST)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const headers = new Headers({'Content-Type': 'application/json'});
            const username = action.payload;
            const routerState = (state as any).router.state;
            const documentId = routerState.params.id;
            return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
            .then(() => this._http.post(
                `/api/document/contributors/${documentId}`,
                JSON.stringify({'user_to_add': username}),
                {headers: headers})
            .toPromise().then(res => {
                const status = res.status;
                if (status === 201) {
                    return new BubbleAction.AddContributerRequestSuccess('invitation sent');
                } else {
                    return new BubbleAction.AddContributerRequestFail('something got wrong >< please restart service');
                }
            })).catch((res) => {
                if (res.status === 400) {
                    return new BubbleAction.AddContributerRequestFail('your invitation was not sent');
                } else {
                    return new BubbleAction.AddContributerRequestFail('something got wrong >< please restart service');
                }
            });
        });

    @Effect()
    hideSuggest$: Observable<Action> = this.action$.ofType<BubbleAction.HideSuggest>(BubbleAction.HIDE_SUGGEST)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.hideSuggestBubble(query))
                .map(() => new BubbleAction.HideSuggestPending(null));
        });

    @Effect()
    vote$: Observable<Action> = this.action$.ofType<BubbleAction.VoteOnSuggest>(BubbleAction.VOTE_ON_SUGGEST)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.voteOnSuggestBubble(query))
                .map(() => new BubbleAction.VoteOnSuggestPending(null));
        });

    @Effect()
    unvote$: Observable<Action> = this.action$.ofType<BubbleAction.UnvoteOnSuggest>(BubbleAction.UNVOTE_ON_SUGGEST)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.voteOnSuggestBubble(query))
                .map(() => new BubbleAction.UnvoteOnSuggestPending(null));
        });

    @Effect()
    switchBubble$: Observable<Action> = this.action$.ofType<BubbleAction.SwitchBubble>(BubbleAction.SWITCH_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.switchBubble(query))
                .map(() => new BubbleAction.SwitchBubblePending(null));
        });

    @Effect()
    noteLoad$: Observable<Action> = this.action$.ofType<BubbleAction.NoteLoad>(BubbleAction.NOTE_LOAD)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const docid = bubbleState.documentObject.id;
            const documentUrl = `/api/${docid}/notelist`;
            return this._http.get(documentUrl).map(res => {
                const status = res.status;
                if (status === 200) {
                    const jsonData = JSON.parse(res.text());
                    console.log(jsonData);
                    return new BubbleAction.NoteLoadComplete(jsonData)
                } else {
                    return new BubbleAction.NoteLoadError('unknown error')
                }
            })});

    @Effect()
    noteCreate$: Observable<Action> = this.action$.ofType<BubbleAction.NoteCreate>(BubbleAction.NOTE_CREATE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const docid = bubbleState.documentObject.id;
            const documentUrl = `/api/${docid}/notelist`;
            const headers = new Headers({'Content-Type': 'application/json'});
            return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
                .then(() => this._http.post(documentUrl, JSON.stringify({content: 'empty'}), {headers: headers})
                    .toPromise().then(res => {
                        console.log(res);
                        const status = res.status;
                        if (status === 200) {
                            const jsonData = JSON.parse(res.text());
                            console.log('json data', jsonData);
                            const newNote = new Note(jsonData.id, jsonData.document, jsonData.owner, jsonData.content, jsonData.order);
                            return new BubbleAction.NoteCreateComplete(newNote);
                        } else if (status === 400) {
                            return new BubbleAction.NoteCreateError('content is empty');
                        } else {
                            return new BubbleAction.NoteCreateError('unknown error');
                        }
                    }));
        });


        @Effect()
            noteEdit$: Observable<Action> = this.action$.ofType<BubbleAction.NoteEdit>(BubbleAction.NOTE_EDIT)
                .withLatestFrom(this._store).mergeMap(([action, state]) => {
                    const bubbleState = (state as any).document.bubble;
                    const docid = bubbleState.documentObject.id;
                    console.log(action.payload);
                    const documentUrl = `/api/${docid}/note/${action.payload.owner}`;
                    const headers = new Headers({'Content-Type': 'application/json'});
                    return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
                        .then(() => this._http.put(documentUrl, JSON.stringify({content: action.payload.content}), {headers: headers})
                            .toPromise().then(res => {
                                console.log(res);
                                const status = res.status;
                                if (status === 200) {
                                    return new BubbleAction.NoteEditComplete();
                                } else if (status === 400) {
                                    return new BubbleAction.NoteEditError('user is not doc contributor or Bubble owner');
                                } else {
                                    return new BubbleAction.NoteEditError('unknown error');
                                }
                            }));
                    });
        @Effect()
            noteDelete: Observable<Action> = this.action$.ofType<BubbleAction.NoteDelete>(BubbleAction.NOTE_DELETE)
                    .withLatestFrom(this._store).mergeMap(([action, state]) => {
                        const bubbleState = (state as any).document.bubble;
                        const docid = bubbleState.documentObject.id;
                        console.log(action.payload);
                        const documentUrl = `/api/${docid}/note/${action.payload.owner}`;
                const headers = new Headers({'Content-Type': 'application/json'});
                return this._http.get(this.tokenUrl).toPromise().then(() => headers.append('X-CSRFToken', this.getCookie('csrftoken')))
                    .then(() => this._http.delete(documentUrl, {headers: headers})
                        .toPromise().then(res => {
                            console.log(res);
                            const status = res.status;
                            if (status === 200) {
                                return new BubbleAction.NoteDeleteComplete();
                            } else if (status === 400) {
                                return new BubbleAction.NoteDeleteError('user is not doc contributor or Bubble owner');
                            } else {
                                return new BubbleAction.NoteDeleteError('unknown error');
                            }
                        }));
                    })

    @Effect()
    exportNoteAsBubble$: Observable<Action> =
    this.action$.ofType<BubbleAction.ExportNoteAsBubble>(BubbleAction.EXPORT_NOTE_AS_BUBBLE)
        .withLatestFrom(this._store).mergeMap(([action, state]) => {
            const bubbleState = (state as any).document.bubble;
            const bubbleList = bubbleState.bubbleList;
            const rootBubble: InternalBubble = bubbleState.bubbleList[0];
            console.log(rootBubble);
            const lastLoc = rootBubble.childBubbleIds.reduce((prev, curr) => Math.max(prev, getBubbleById(bubbleList, curr).location), 0);
            return Observable.of(this.bubbleService.exportNoteAsBubble(bubbleList[0].id, lastLoc, action.payload.content))
                .map(() => new BubbleAction.ExportNoteAsBubblePending(null));
        });

    @Effect()
    exportNoteAsSuggest$: Observable<Action> =
    this.action$.ofType<BubbleAction.ExportNoteAsSuggest>(BubbleAction.EXPORT_NOTE_AS_SUGGEST)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.exportNoteAsSuggestBubble(query.bindBubbleId, query.content))
                .map(() => new BubbleAction.ExportNoteAsSuggestPending(null));
        });

    @Effect()
    exportNoteAsCommentOnBubble$: Observable<Action> =
    this.action$.ofType<BubbleAction.ExportNoteAsCommentOnBubble>(BubbleAction.EXPORT_NOTE_AS_COMMENT_ON_BUBBLE)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.exportNoteAsCommentOnBubble(query.bindBubbleId, query.content))
                .map(() => new BubbleAction.ExportNoteAsCommentOnBubblePending(null));
        });

    @Effect()
    exportNoteAsCommentOnSuggest$: Observable<Action> =
    this.action$.ofType<BubbleAction.ExportNoteAsCommentOnSuggest>(BubbleAction.EXPORT_NOTE_AS_COMMENT_ON_SUGGEST)
        .map(action => action.payload).mergeMap(query => {
            return Observable.of(this.bubbleService.exportNoteAsCommentOnSuggestBubble(query.bindSuggestBubbleId, query.content))
                .map(() => new BubbleAction.ExportNoteAsCommentOnSuggestPending(null));
        });

    getCookie(name) {
            const value = ';' + document.cookie;
            const parts = value.split(';' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }

    constructor(
        private action$: Actions,
        private _store: Store<fromDocument.State>,
        private bubbleService: BubbleService,
        private _http: Http
    ) {}
}
