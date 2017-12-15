import { Injectable } from '@angular/core';
import { MockBubbleRoot, MockBubbleList } from '../models/bubble.mock';
import { Bubble, LeafBubble, InternalBubble, SuggestBubble, BubbleType } from '../models/bubble';
import { Subscription } from 'rxjs/Subscription';
import { ServerSocket } from './websocket.service';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { MenuType } from './event/event-bubble.service';

import * as Reducer from '../reducers/reducer';
import * as BubbleAction from '../actions/bubble-action';
import * as fromUser from '../../user/actions/user-action';
import { BubbleJsonHelper } from '../models/bubble-json-helper';
import { OnDestroy } from '@angular/core';

let USE_MOCK = true;
let Id = 30; // to be deleted after backend implemented
const UserId = 1;

@Injectable()
export class BubbleService implements OnDestroy {

    private socketSubscription: Subscription;
    private currentDocumentId: number;
    private bubbleList: Array<Bubble> = [];
    private bubbleRoot: InternalBubble;
    private user$: Observable<>;
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

        this.user$ = _store.select(fromUser.getUserState).
            map(userState => this.userId = userState.userId);

        if (USE_MOCK) {
            this._getBubbleList().then(bubbleList => {
                for (const bubble of bubbleList) {
                    if (bubble.type === BubbleType.internalBubble) {
                        const internalBubble = bubble as InternalBubble;
                        for (let i = 0; i < internalBubble.childBubbleIds.length; i++) {
                            const childBubbleId = internalBubble.childBubbleIds[i];
                            bubbleList[childBubbleId].parentBubbleId = internalBubble.id;
                            bubbleList[childBubbleId].location = i;
                        }
                    }
                }
                this.bubbleList = bubbleList;
            });
        }
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
                this.previousRequestId = Number(body.previous_request);
                contributors = BubbleJsonHelper.getUserArrayObject(JSON.stringify(body.contributors));
                connectors = BubbleJsonHelper.getUserArrayObject(JSON.stringify(body.connectors));
                this._store.dispatch(new BubbleAction.OpenComplete(Number(body.document_id), contributors, connectors);
            } else {
                console.log('received open_document fail');
                this._store.dispatch(new BubbleAction.OpenError(body));
            }
        } else if (command === 'someone_open_document_detail') {
            if (accept === 'True') {
                console.log('received someone_open_document_detail');
                connector = BubbleJsonHelper.getUserObject(JSON.stringify(body));
                this._store.dispatch(new BubbleAction.OthersOpenDocument(connector));
            } else {
                // this cannot happen
            }
        } else if (command === 'close_document') {
            if (accept === 'True') {
                console.log('received close_document success');
                this.currentDocumentId = 0;
                this.previousRequestId = 0;
                this_store.dispatch(new BubbleAction.CloseComplete());
            } else {
                console.log('received close_document fail');
                // TODO: decide whether to send it again or not
                this._store.dispatch(new BubbleAction.CloseError(body));
            }
        } else if (command === 'someone_close_document_detail') {
            if (accept === 'True') {
                console.log('received someone_close_document_detail');
                disconnector = BubbleJsonHelper.getUserObject(JSON.stringify(body));
                this._store.dispatch(new BubbleAction.OthersCloseDocument(disconnector));
            } else {
                // this cannot happen
            }
        } else if (command === 'get_bubble_list') {
            if (accept === 'True') {
                console.log('received get_bubble_list success');
                console.log(JSON.stringify(body));
                const bubbleArray = BubbleJsonHelper.getBubbleArrayObject(JSON.stringify(body));
                this._store.dispatch(new BubbleAction.LoadComplete(bubbleArray));
            } else {
                console.log('received get_bubble_list fail');
                this._store.dispatch(new BubbleAction.LoadError(body));
            }
        } else if (command === 'get_suggest_bubble_list') {
            if (accept === 'True') {
                console.log('received get_suggest_bubble_list success');
                console.log(JSON.stringify(body));
                const suggestBubbleArray = BubbleJsonHelper.getSuggestBubbleArrayObject(JSON.stringify(body));
                this._store.dispatch(new BubbleAction.LoadSuggestComplete(suggestBubbleArray));
            } else {
                console.log('received get_suggest_bubble_list fail');
                this._store.dispatch(new BubbleAction.LoadSuggestErrorbody));
            }
        } else if (command === 'get_comment_list_for_bubble') {
            if (accept === 'True') {
                console.log('received get_comment_list_for_bubble success');
                // const commentArray = BubbleJsonHelper.getCommentArray(body));
                // this._store.dispatch(new BubbleAction.LoadCommentOnBubbleComplete(commentArray));
            } else {
                console.log('received get_comment_list_for_bubble fail');
                this._store.dispatch(new BubbleAction.LoadCommentOnBubbleError(body));
            }
        } else if (command === 'create_bubble') {
            if (accept === 'True') {
                const bubble = BubbleJsonHelper.getBubbleObject(JSON.stringify(body.content));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.CreateComplete(bubble));
                } else {
                    this._store.dispatch(new BubbleAction.OthersCreate(bubble));
                }
                this.previousRequestId = data.reqeust_id;
                console.log('received create_bubble success');
            } else {
                this._store.dispatch(new BubbleAction.CreateError(body));
                console.log('received create_bubble fail');
            }
        } else if (command === 'create_suggest_bubble') {
            if (accept === 'True') {
                console.log('received create_suggest_bubble success');
                const suggestBubble = BubbleJsonHelper.getSuggestBubbleObject(JSON.stringify(body.content));
                if (body.who === this.userId) {
                    this._store.dispatch(new BubbleAction.CreateSuggestComplete(suggestBubble));
                } else {
                    this._store.dispatch(new BubbleAction.OthersCreateSuggestComplete(suggestBubble));
                }
            } else {
                console.log('received create_suggest_bubble fail');
                this._store.dispatch(new BubbleAction.CreateSuggestError(body));
            }
        } else if (command === 'edit_bubble') {
            if (accept === 'True') {
                console.log('received edit_bubble success');
                // TODO: FRONT needs EditUpdate with bubble id
            } else {
                console.log('received edit_bubble fail');
            }
        } else if (command === 'finish_editting_bubble') {
            if (accept === 'True') {
            // TODO: FRONT needs EditComplete with bubble id
            } else {

            }
        } else if (command === 'pop_bubble') {
            if (accept === 'True') {
                console.log('received pop_bubble success');
                this._store.dispatch(new BubbleAction.PopComplete(body.bubble_id));
                // TODO: FRONT needs PopComplete with bubble id
            } else {
                console.log('received pop_bubble fail');
                console.log(body);
                this._store.dispatch(new BubbleAction.PopError(body));
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

    public getBubbleList() {
        const m = {'header': 'get_bubble_list',
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
        // parent: parent bubble id (int)
        // location: nth child (0 ~ #currentchildbubble) (int)
        // content: (string)
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
            'body': {'binded_bubble': bindedBubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public createCommentOnNormalBubble(bindedBubbleId: number, content: string) {
        const m = {'header': 'create_comment_on_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_bubble': bindedBubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public createCommentOnSuggestBubble(bindedSuggestBubbleId: number, content: string) {
        const m = {'header': 'create_comment_on_suggest_bubble',
            'previous_request': this.previousRequestId,
            'body': {'binded_suggest_bubble': bindedSuggestBubbleId,
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

    public finishEdittingBubble(bubbleId: number) {
        const m = {'header': 'finish_editting_bubble',
            'previous_request': this.previousRequestId,
            'body': {'bubble_id': bubbleId}};
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
            'body': {'bubble_id_list': wrapBubbleIdList}};
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
                'split_bubble_id_list': splitBubbleIdList}};
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
            'body': {'merge_bubble_id_list': mergeBubbleIdList}};
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

    public async _wrapBubble(wrapBubbleList: Array<number>): Promise<InternalBubble> {
        await this.delay(1000);
        return Promise.resolve(new InternalBubble(this._getTempBubbleId()));
    }

    public async _mergeBubble(mergeBubbleIds: Array<number>): Promise<Bubble> {
        await this.delay(1000);
        return Promise.resolve(new LeafBubble(this._getTempBubbleId()));
    }
    public async _flattenBubble(bubble_id: number): Promise<Bubble> {
        await this.delay(1000);
        return Promise.resolve(new LeafBubble(this._getTempBubbleId()));
    }

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
