import { Injectable } from '@angular/core';
import { MockBubbleRoot, MockBubbleList } from '../models/bubble.mock';
import { Bubble, LeafBubble, InternalBubble, SuggestBubble, BubbleType } from '../models/bubble';
import { Comment } from '../models/comment';
import { User } from '../../user/models/user';
import { Document } from '../../file/models/document';
import { Subscription } from 'rxjs/Subscription';
import { ServerSocket } from './websocket.service';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { MenuType } from './event/event-bubble.service';

import * as Reducer from '../reducers/reducer';
import * as BubbleAction from '../actions/bubble-action';
import * as fromUser from '../../user/reducers/reducer';
import { BubbleJsonHelper } from '../models/bubble-json-helper';
import { OnDestroy } from '@angular/core';

let Id = 30; // to be deleted after backend implemented
const UserId = 1;

@Injectable()
export class BubbleService implements OnDestroy {

    private socketSubscription: Subscription;
    private currentDocumentId: number;
    private bubbleList: Array<Bubble> = [];
    private bubbleRoot: InternalBubble;
    private user$: Observable<User>;
    private previousRequestId: number;
    private userId: number;

    constructor(
            private _store: Store<Reducer.State>,
            private _socket: ServerSocket,
            private _http: Http)  {
        const stream = this._socket.connect();
        this.socketSubscription = stream.subscribe(message => {
                console.log('recevied message from server: ', message);
                this.channelMessageHandler(message);
        });

        this._store.select(fromUser.getUserState).subscribe(userState => {
            this.userId = userState.userId;
        });
    }

    ngOnDestroy() {
        this.socketSubscription.unsubscribe();
    }

    channelMessageHandler(msg) {
        const data = msg;
        // let data = JSON.parse(msg);
        // TODO: check if data has appropriate elements

        const command = data.header;
        const accept = data.accept;
        const body = data.body;

        if (command === 'open_document') {
            if (accept === 'True') {
                console.log('received open_document success');
                this.currentDocumentId = Number(body.document_id);
                this.previousRequestId = Number(body.previous_request_id);
                const doc: Document = BubbleJsonHelper.getDocumentObject(JSON.stringify(body));
                const connectorIdList = body.connectors;
                const cons = [];
                try {
                    for (const connectorId of connectorIdList) {
                        for (const contributor of doc.contributors) {
                            if (contributor.id === connectorId)
                                cons.push({
                                        'id': connectorId,
                                        'username': contributor.username,
                                        'email': contributor.email,
                                        });
                        }
                    }
                    throw new Error('cannot find connector in contributors');
                } catch {
                }
                const connectors = BubbleJsonHelper.getUserArrayObject(JSON.stringify(cons));
                this._store.dispatch(new BubbleAction.OpenComplete({documentObject: doc, connectors: connectors}));
            } else {
                console.log('received open_document fail');
                this._store.dispatch(new BubbleAction.OpenError(body));
            }
        } else if (command === 'someone_open_document_detail') {
            if (accept === 'True') {
                console.log('received someone_open_document_detail');
                if (body.connector_id !== this.userId) {
                    this._store.dispatch(new BubbleAction.OthersOpenDocument(body.connector_id));
                }
            } else {
                // this cannot happen
            }
        } else if (command === 'close_document') {
            if (accept === 'True') {
                console.log('received close_document success');
                this.currentDocumentId = 0;
                this.previousRequestId = 0;
                this._store.dispatch(new BubbleAction.CloseComplete(null));
            } else {
                console.log('received close_document fail');
                // TODO: decide whether to send it again or not
                this._store.dispatch(new BubbleAction.CloseError(body));
            }
        } else if (command === 'someone_close_document_detail') {
            if (accept === 'True') {
                console.log('received someone_close_document_detail');
                this._store.dispatch(new BubbleAction.OthersCloseDocument(body.disconnector_id));
            } else {
                // this cannot happen
            }
        } else if (command === 'get_whole_document') {
            if (accept === 'True') {
                console.log('received get_whole_document success');
                console.log(body);
                const bubbleList = BubbleJsonHelper.getBubbleArrayObject(JSON.stringify(body.bubble_list));
                const suggestBubbleList = BubbleJsonHelper.getSuggestBubbleArrayObject(JSON.stringify(body.suggest_bubble_list));
                const commentList = BubbleJsonHelper.getCommentArrayObject(JSON.stringify(body.comment_list));
                const noteList = BubbleJsonHelper.getNoteArrayObject(JSON.stringify(body.note_list));
                this._store.dispatch(new BubbleAction.LoadComplete(
                            {bubbleList: bubbleList, suggestBubbleList: suggestBubbleList,
                            commentList: commentList, noteList: noteList}));
            } else {
                console.log('received get_whole_document fail');
                this._store.dispatch(new BubbleAction.LoadError(body));
            }
        } else if (command === 'create_bubble') {
            if (accept === 'True') {
                const bubble = BubbleJsonHelper.getBubbleObject(JSON.stringify(body));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.CreateBubbleComplete(bubble));
                } else {
                    this._store.dispatch(new BubbleAction.OthersCreateBubble(bubble));
                }
                this.previousRequestId = data.request_id;
                console.log('received create_bubble success');
            } else {
                this._store.dispatch(new BubbleAction.CreateBubbleError(body));
                console.log('received create_bubble fail');
            }
        } else if (command === 'create_suggest_bubble') {
            if (accept === 'True') {
                console.log('received create_suggest_bubble success');
                const suggestBubble = BubbleJsonHelper.getSuggestBubbleObject(JSON.stringify(body));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.CreateSuggestComplete(suggestBubble));
                } else {
                    this._store.dispatch(new BubbleAction.OthersCreateSuggest(suggestBubble));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received create_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.CreateSuggestError(body));
            }
        } else if (command === 'create_comment_on_bubble') {
            if (accept === 'True') {
                console.log('received create_comment_on_bubble success');
                const comment = BubbleJsonHelper.getCommentObject(JSON.stringify(body));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.CreateCommentOnBubbleComplete(comment));
                } else {
                    this._store.dispatch(new BubbleAction.OthersCreateCommentOnBubble(comment));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received create_comment_on_bubble fail');
                this._store.dispatch(new BubbleAction.CreateCommentOnBubbleError(body));
            }
        } else if (command === 'create_comment_on_suggest_bubble') {
            if (accept === 'True') {
                console.log('received crate_comment_on_suggest_bubble success');
                const comment = BubbleJsonHelper.getCommentObject(JSON.stringify(body));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.CreateCommentOnSuggestComplete(comment));
                } else {
                    this._store.dispatch(new BubbleAction.OthersCreateCommentOnSuggest(comment));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received create_comment_on_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.CreateCommentOnSuggestError(body));
            }
        } else if (command === 'edit_bubble') {
            if (accept === 'True') {
                console.log('received edit_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.EditRequestSuccess({userId: this.userId, bubbleId: Number(body.bubble_id)}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersEditRequest({userId: body.who, bubbleId: Number(body.bubble_id)}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received edit_bubble fail');
                this._store.dispatch(new BubbleAction.EditBubbleError(body));
            }
        } else if (command === 'update_content_of_editting_bubble') {
            if (accept === 'True') {
                console.log('received update_content_of_editting_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.EditUpdateSuccess(
                                {bubbleId: Number(body.bubble_id), content: body.content}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersEditUpdate(
                                {bubbleId: Number(body.bubble_id), content: body.content}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received update_content_of_editting_bubble fail');
                this._store.dispatch(new BubbleAction.EditBubbleError(body));
            }
        } else if (command === 'finish_editting_bubble') {
            if (accept === 'True') {
                console.log('received finish_editting_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.EditCompleteSuccess(
                                {bubbleId: Number(body.bubble_id),
                                content: String(body.content)}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersEditComplete(
                                {bubbleId: Number(body.bubble_id),
                                content: String(body.content)}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received finish_editting_bubble fail');
                this._store.dispatch(new BubbleAction.EditBubbleError(body));
            }
        } else if (command === 'discard_editting_bubble') {
            if (accept === 'True') {
                console.log('received discard_editting_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.EditDiscardSuccess(
                                {bubbleId: Number(body.bubble_id), content: body.content}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersEditDiscard(
                                {bubbleId: Number(body.bubble_id), content: body.content}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received discard_editting_bubble fail');
                this._store.dispatch(new BubbleAction.EditBubbleError(body));
            }
        } else if (command === 'release_ownership_of_bubble') {
            if (accept === 'True') {
                console.log('received release_ownership_of_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.ReleaseOwnershipComplete(Number(body.bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersReleaseOwnership(Number(body.bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received release_ownership_of_bubble success');
                this._store.dispatch(new BubbleAction.ReleaseOwnershipError(body));
            }
        } else if (command === 'edit_suggest_bubble') {
            if (accept === 'True') {
                console.log('received edit_suggest_bubble success');
                const suggestBubble = BubbleJsonHelper.getSuggestBubbleObject(JSON.stringify(body.new_editted_suggest_bubble));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.EditSuggestComplete(
                                {hidedSuggestBubbleId: Number(body.hided_suggest_bubble_id),
                                newEdittedSuggestBubble: suggestBubble}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersEditSuggest(
                                {hidedSuggestBubbleId: Number(body.hided_suggest_bubble_id),
                                newEdittedSuggestBubble: suggestBubble}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received edit_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.EditSuggestError(body));
            }
        } else if (command === 'edit_comment_on_bubble') {
            if (accept === 'True') {
                console.log('received edit_comment_on_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.EditCommentOnBubbleComplete(
                                {commentId: Number(body.comment_id), content: String(body.content)}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersEditCommentOnBubble(
                                {commentId: Number(body.comment_id), content: String(body.content)}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received edit_comment_on_bubble fail');
                this._store.dispatch(new BubbleAction.EditCommentOnBubbleError(body));
            }
        } else if (command === 'edit_comment_on_suggest_bubble') {
            if (accept === 'True') {
                console.log('received edit_comment_on_suggest_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.EditCommentOnSuggestComplete(
                                {commentId: Number(body.comment_id), content: String(body.content)}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersEditCommentOnSuggest(
                                {commentId: Number(body.comment_id), content: String(body.content)}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received edit_comment_on_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.EditCommentOnSuggestError(body));
            }

        } else if (command === 'delete_bubble') {
            if (accept == 'True') {
                console.log('received delete_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.DeleteBubbleComplete(Number(body.bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersDeleteBubble(Number(body.bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received delete_bubble fail');
                this._store.dispatch(new BubbleAction.DeleteBubbleError(body));
            }
        } else if (command === 'hide_suggest_bubble') {
            if (accept == 'True') {
                console.log('received hide_suggest_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.HideSuggestComplete(Number(body.suggest_bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersHideSuggest(Number(body.suggest_bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received hide_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.HideSuggestError(body));
            }
        } else if (command === 'show_suggest_bubble') {
            if (accept == 'True') {
                console.log('received show_suggest_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.ShowSuggestComplete(Number(body.suggest_bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersShowSuggest(Number(body.suggest_bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received show_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.ShowSuggestError(body));
            }
        } else if (command === 'delete_comment_on_bubble') {
            if (accept == 'True') {
                console.log('received delete_comment_on_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.DeleteCommentOnBubbleComplete(Number(body.comment_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersDeleteCommentOnBubble(Number(body.comment_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received delete_comment_on_bubble fail');
                this._store.dispatch(new BubbleAction.DeleteCommentOnBubbleError(body));
            }
        } else if (command === 'delete_comment_on_suggest_bubble') {
            if (accept == 'True') {
                console.log('received delete_comment_on_suggest_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.DeleteCommentOnSuggestComplete(Number(body.comment_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersDeleteCommentOnSuggest(Number(body.comment_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received delete_comment_on_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.DeleteCommentOnSuggestError(body));
            }
        } else if (command === 'move_bubble') {
            if (accept == 'True') {
                console.log('received move_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.MoveBubbleComplete(
                                {bubbleId: Number(body.bubble_id), newParentId: Number(body.new_parent_id),
                                newLocation: Number(body.new_location)}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersMoveBubble(
                                {bubbleId: Number(body.bubble_id), newParentId: Number(body.new_parent_id),
                                newLocation: Number(body.new_location)}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received move_bubble fail');
                this._store.dispatch(new BubbleAction.MoveBubbleError(body));
            }
        } else if (command === 'wrap_bubble') {
            if (accept == 'True') {
                console.log('received wrap_bubble success');

                const newWrappedBubble = BubbleJsonHelper.getBubbleObject(JSON.stringify(body.new_wrapped_bubble));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.WrapBubbleComplete(
                                {wrapBubbleIdList: body.wrap_bubble_id_list, newWrappedBubble: newWrappedBubble}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersWrapBubble(
                                {wrapBubbleIdList: body.wrap_bubble_id_list, newWrappedBubble: newWrappedBubble}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received wrap_bubble fail');
                this._store.dispatch(new BubbleAction.WrapBubbleError(body));
            }
        } else if (command === 'pop_bubble') {
            if (accept == 'True') {
                console.log('received pop_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.PopBubbleComplete(Number(body.bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersPopBubble(Number(body.bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received pop_bubble fail');
                this._store.dispatch(new BubbleAction.PopBubbleError(body));
            }
        } else if (command === 'split_internal_bubble') {
            if (accept == 'True') {
                console.log('received split_internal_bubble success');
                const splitBubbleObjectList = BubbleJsonHelper.getBubbleArrayObject(body.split_bubble_object_list);
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.SplitInternalComplete(
                                {bubbleId: Number(body.bubble_id), splitBubbleObjectList: splitBubbleObjectList}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersSplitInternal(
                                {bubbleId: Number(body.bubble_id), splitBubbleObjectList: splitBubbleObjectList}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received split_internal_bubble fail');
                this._store.dispatch(new BubbleAction.SplitInternalError(body));
            }
        } else if (command === 'split_leaf_bubble') {
            if (accept == 'True') {
                console.log('received split_leaf_bubble success');
                const splitBubbleObjectList = BubbleJsonHelper.getBubbleArrayObject(JSON.stringify(body.split_bubble_object_list));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.SplitLeafComplete(
                                {bubbleId: Number(body.bubble_id), splitBubbleObjectList: splitBubbleObjectList}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersSplitLeaf(
                                {bubbleId: Number(body.bubble_id), splitBubbleObjectList: splitBubbleObjectList}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received split_leaf_bubble fail');
                this._store.dispatch(new BubbleAction.SplitLeafError(body));
            }
        } else if (command === 'merge_bubble') {
            if (accept == 'True') {
                console.log('received merge_bubble success');
                const mergedBubble = BubbleJsonHelper.getBubbleObject(JSON.stringify(body.merged_bubble));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.MergeBubbleComplete(
                                {bubbleIdList: body.merge_bubble_id_list, mergedBubble: mergedBubble}));
                } else {
                    this._store.dispatch(new BubbleAction.OthersMergeBubble(
                                {bubbleIdList: body.merge_bubble_id_list, mergedBubble: mergedBubble}));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received merge_bubble fail');
                this._store.dispatch(new BubbleAction.MergeBubbleError(body));
            }
        } else if (command === 'flatten_bubble') {
            if (accept == 'True') {
                console.log('received flatten_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.FlattenBubbleComplete(Number(body.bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersFlattenBubble(Number(body.bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received flatten_bubble fail');
                this._store.dispatch(new BubbleAction.FlattenBubbleError(body));
            }
        } else if (command === 'switch_bubble') {
            if (accept == 'True') {
                console.log('received switch_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.SwitchBubbleComplete(Number(body.suggest_bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersSwitchBubble(Number(body.suggest_bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received switch_bubble fail');
                this._store.dispatch(new BubbleAction.SwitchBubbleError(body));
            }
        } else if (command === 'vote_on_suggest_bubble') {
            if (accept == 'True') {
                console.log('received vote_on_suggest_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.VoteOnSuggestComplete(Number(body.suggest_bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersVoteOnSuggest(Number(body.suggest_bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received vote_on_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.VoteOnSuggestError(body));
            }
        } else if (command === 'unvote_on_suggest_bubble') {
            if (accept == 'True') {
                console.log('received unvote_on_suggest_bubble success');
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.UnvoteOnSuggestComplete(Number(body.suggest_bubble_id)));
                } else {
                    this._store.dispatch(new BubbleAction.OthersUnvoteOnSuggest(Number(body.suggest_bubble_id)));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received unvote_on_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.UnvoteOnSuggestError(body));
            }
        } else if (command === 'export_note_as_bubble') {
            if (accept == 'True') {
                console.log('received export_note_as_bubble success');
                const bubble = BubbleJsonHelper.getBubbleObject(JSON.stringify(body.new_bubble));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.ExportNoteAsBubbleComplete(bubble));
                } else {
                    this._store.dispatch(new BubbleAction.OthersExportNoteAsBubble(bubble));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received export_note_as_bubble fail');
                this._store.dispatch(new BubbleAction.ExportNoteAsBubbleError(body));
            }
        } else if (command === 'export_note_as_suggest_bubble') {
            if (accept == 'True') {
                console.log('received export_note_as_suggest_bubble success');
                const suggestBubble = BubbleJsonHelper.getSuggestBubbleObject(JSON.stringify(body.new_suggest_bubble));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.ExportNoteAsSuggestComplete(suggestBubble));
                } else {
                    this._store.dispatch(new BubbleAction.OthersExportNoteAsSuggest(suggestBubble));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received export_note_as_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.ExportNoteAsSuggestError(body));
            }
        } else if (command === 'export_note_as_comment_under_bubble') {
            if (accept == 'True') {
                console.log('received export_note_as_comment_under_bubble success');
                const comment = BubbleJsonHelper.getCommentObject(JSON.stringify(body.new_comment));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.ExportNoteAsCommentOnBubbleComplete(comment));
                } else {
                    this._store.dispatch(new BubbleAction.OthersExportNoteAsCommentOnBubble(comment));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received export_note_as_comment_under_bubble fail');
                this._store.dispatch(new BubbleAction.ExportNoteAsCommentOnBubbleError(body));
            }
        } else if (command === 'export_note_as_comment_under_suggest_bubble') {
            if (accept == 'True') {
                console.log('received export_note_as_comment_under_suggest_bubble success');
                const comment = BubbleJsonHelper.getCommentObject(JSON.stringify(body.new_comment));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.ExportNoteAsCommentOnSuggestComplete(comment));
                } else {
                    this._store.dispatch(new BubbleAction.OthersExportNoteAsCommentOnSuggest(comment));
                }
                this.previousRequestId = data.request_id;
            } else {
                console.log('received export_note_as_comment_under_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.ExportNoteAsCommentOnSuggestError(body));
            }
        } else if (command === 'someone_added_as_contributor') {
            if (accept == 'True') {
                const user = BubbleJsonHelper.getUserObjects(JSON.stringify(body));
                if (user.who === this.userId) {
                    // this cannot happen
                    console.log('someone added as contributor error: i am added');
                } else {
                    console.log('received someone_added_as_contributor success');
                    this._store.dispatch(new BubbleAction.OthersAddedAsContributor(user));
                }
                this.previousRequestId = data.request_id;
            } else {
                // this cannot happen
                console.log('someone added as contributor fail. this cannot happen');
            }
 
        }
    }

    public openDocument(documentId: number) {
        const m = {'header': 'open_document',
            'previous_request': 0,
            'body': {'document_id': documentId}};
        console.log('send open_document');
        this._socket.send(m);
    }

    public closeDocument(documentId: number) {
        const m = {'header': 'close_document',
            'previous_request': this.previousRequestId,
            'body': {'document_id': documentId}};
        this._socket.send(m);
    }

    public getWholeDocument() {
        const m = {'header': 'get_whole_document',
            'previous_request': this.previousRequestId,
            'body': {'empty': 'empty'}};
        this._socket.send(m);
    }

    public getSuggestBubbleList(bubbleId: number) {
        const m = {'header': 'get_suggest_bubble_list',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public getCommentListForBubble(bubbleId: number) {
        const m = {'header': 'get_comment_list_for_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public getCommentListForSuggestBubble(suggestBubbleId: number) {
        const m = {'header': 'get_comment_list_for_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': suggestBubbleId}};
        this._socket.send(m);
    }

    public createBubble(parentId: number, loc: number, content: string) {
        const m = {'header': 'create_bubble',
            'previous_request': this.previousRequestId,
            'body': {'parent_id': parentId,
                'location': loc,
                'content': content}};
        this._socket.send(m);
    }

    public createSuggestBubble(bindedBubbleId: number, content: string) {
        const m = {'header': 'create_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_bubble_id': bindedBubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public createCommentOnBubble(bindedBubbleId: number, content: string) {
        const m = {'header': 'create_comment_on_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_bubble_id': bindedBubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public createCommentOnSuggestBubble(bindedSuggestBubbleId: number, content: string) {
        const m = {'header': 'create_comment_on_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_suggest_bubble_id': bindedSuggestBubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public startEdittingBubble(bubbleId: number) {
        const m = {'header': 'edit_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public updateEdittingBubble(bubbleId: number, content: string) {
        const m = {'header': 'update_content_of_editting_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public finishEdittingBubble(bubbleId: number, content: string) {
        const m = {'header': 'finish_editting_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId, 'content': content}};
        this._socket.send(m);
    }

    public discardEdittingBubble(bubbleId: number) {
        const m = {'header': 'discard_editting_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public releaseOwnershipOfBubble(bubbleId: number) {
        const m = {'header': 'release_ownership_of_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public editSuggestBubble(suggestBubbleId: number, content: string) {
        const m = {'header': 'edit_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'suggest_bubble_id': suggestBubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public editCommentOnBubble(commentId: number, content: string) {
        const m = {'header': 'edit_comment_on_bubble',
            'previous_request': this.previousRequestId,
            'body': {'comment_id': commentId, 'content': content}};
        this._socket.send(m);
    }

    public editCommentOnSuggestBubble(commentId: number, content: string) {
        const m = {'header': 'edit_comment_on_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'comment_id': commentId, 'content': content}};
        this._socket.send(m);
    }

    public deleteBubble(bubbleId: number) {
        const m = {'header': 'delete_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public hideSuggestBubble(suggestBubbleId: number) {
        const m = {'header': 'hide_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'suggeest_bubble_id': suggestBubbleId}};
        this._socket.send(m);
    }

    public showSuggestBubble(suggestBubbleId: number) {
        const m = {'header': 'show_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'suggest_bubble_id': suggestBubbleId}};
        this._socket.send(m);
    }

    public deleteCommentOnBubble(commentId: number) {
        const m = {'header': 'delete_comment_on_bubble',
            'previous_request': this.previousRequestId,
            'body': {'comment_id': commentId}};
        this._socket.send(m);
    }

    public deleteCommentOnSuggestBubble(commentId: number) {
        const m = {'header': 'delete_comment_on_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'comment_id': commentId}};
        this._socket.send(m);
    }

    public moveBubble(bubbleId: number, newParentId: number, newLocation: number) {
        const m = {'header': 'move_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId,
                'new_parent_id': newParentId,
                'new_location': newLocation}};
        this._socket.send(m);
    }

    public wrapBubble(wrapBubbleIdList: Array<number>) {
        const m = {'header': 'wrap_bubble',
            'previous_request': this.previousRequestId,
            'body': {'wrap_bubble_id_list': [...wrapBubbleIdList]}};
        this._socket.send(m);
    }

    public popBubble(bubbleId: number) {
        const m = {'header': 'pop_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public splitInternalBubble(bubbleId: number, splitBubbleIdList: Array<number>) {
        const m = {'header': 'split_internal_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId,
                'split_bubble_id_list': [...splitBubbleIdList]}};
        this._socket.send(m);
    }

    public splitLeafBubble(bubbleId: number, splitContentList: Array<String>) {
        const m = {'header': 'split_leaf_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId,
                'split_content_list': [...splitContentList]}};
        this._socket.send(m);
    }

    public mergeBubble(mergeBubbleIdList: Array<number>) {
        const m = {'header': 'merge_bubble',
            'previous_request': this.previousRequestId,
            'body': {'merge_bubble_id_list': [...mergeBubbleIdList]}};
        this._socket.send(m);
    }

    public flattenBubble(bubbleId: number) {
        const m = {'header': 'flatten_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
        this._socket.send(m);
    }

    public switchBubble(suggestBubbleId: number) {
        const m = {'header': 'switch_bubble',
            'previous_request': this.previousRequestId,
            'body': {'suggest_bubble_id': suggestBubbleId}};
        this._socket.send(m);
    }

    public voteOnSuggestBubble(suggestBubbleId: number) {
        const m = {'header': 'vote_on_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'suggest_bubble_id': suggestBubbleId}};
        this._socket.send(m);
    }

    public unvoteOnSuggestBubble(suggestBubbleId: number) {
        const m = {'header': 'unvote_on_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'suggest_bubble_id': suggestBubbleId}};
        this._socket.send(m);
    }

    public exportNoteAsBubble(parentId: number, loc: number, noteId: number) {
        const m = {'header': 'export_note_as_bubble',
            'previous_request': this.previousRequestId,
            'body': {'parent_id': parentId, 'location': loc, 'note_id': noteId}};
        this._socket.send(m);
    }

    public exportNoteAsSuggestBubble(bindedBubbleId: number, noteId: number) {
        const m = {'header': 'export_note_as_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_bubble_id': bindedBubbleId, 'note_id': noteId}};
        this._socket.send(m);
    }

    public exportNoteAsCommentOnBubble(bindedBubbleId: number, noteId: number) {
        const m = {'header': 'export_note_as_comment_on_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_bubble_id': bindedBubbleId, 'note_id': noteId}};
        this._socket.send(m);
    }

    public exportNoteAsCommentOnSuggestBubble(bindedSuggestBubbleId: number, noteId: number) {
        const m = {'header': 'export_note_as_comment_on_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_suggest_bubble_id': bindedSuggestBubbleId, 'note_id': noteId}};
        this._socket.send(m);
    }



    // these are legacy codes

    public splitBubble(bubbleId: number, contentList: Array<string>) {
        const splitBubbleList: Array<Bubble> = [];
        for (let content of contentList) {
            splitBubbleList.push(new LeafBubble(this._getTempBubbleId(), content));
        }
        return Promise.resolve(splitBubbleList);
    }



    public _moveBubble(bubbleId: number, destBubbleId: number, isAbove: boolean) {
    }

    public async _createBubble(bubbleId: number, isAbove: boolean): Promise<Bubble> {
        await this.delay(1000);
        return Promise.resolve(new LeafBubble(this._getTempBubbleId(), 'new string'));
    }

    private _tempBubbleId = 60;
    private _getTempBubbleId(): number {
        return this._tempBubbleId++;
    }

    private _getBubbleList(): Promise<Array<Bubble>> {
        this.bubbleRoot = MockBubbleRoot;
        return Promise.resolve(MockBubbleList);
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
