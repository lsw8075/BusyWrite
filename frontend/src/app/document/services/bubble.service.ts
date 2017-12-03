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

let USE_MOCK = true;
let Id = 30; // to be deleted after backend implemented
const UserId = 1;

@Injectable()
export class BubbleService {

    private socketSubscription: Subscription;
    private currentDocumentId: Number;
    private bubbleList: Array<Bubble> = [];
    private bubbleRoot: InternalBubble;
    //private user$: Observable<>; 

    constructor(
            private _store: Store<Reducer.State>,
            private _socket: ServerSocket,
            private _http: Http)  {
        const stream = this._socket.connect();
        console.log(stream);
        this.socketSubscription = stream.subscribe(message => {
                console.log('recevied message from server: ', message);
                this.channelMessageHandler(message);
        });

        //this.user$ = _store.select(fromUser.getUserState).
        //    map(userState => userState.userId);

        if (USE_MOCK) {
            this._getBubbleList().then(bubbleList => {
                for (let bubble of bubbleList) {
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

        console.log(msg);
        let data = msg;
        //let data = JSON.parse(msg);
        // TODO: check if data has appropriate elements
        let command = data.header;
        let accept = data.accept;
        let body = data.body;

        if (command === 'open_document') {
            if (accept === 'True') {
                console.log('received open_document success');
                this.currentDocumentId = Number(body.document_id);
                this._store.dispatch(new BubbleAction.OpenComplete(Number(body.document_id)));
            } else {
                console.log('received open_document fail');
                this._store.dispatch(new BubbleAction.OpenError(body));
            }
        } else if (command === 'close_document') {
            if (accept === 'True') {
                console.log('received close_document success');
                this.currentDocumentId = 0;
                // TODO:
            } else {
                console.log('received close_document fail');
                // TODO: decide whether to send it again or not
            }
        } else if (command === 'get_bubble_list') {
            if (accept === 'True') {
                console.log('received get_bubble_list success');
                console.log(body.content);
                const bubbleArray = new BubbleJsonHelper.getBubbleArrayObject(String(body));
                this._store.dispatch(new BubbleAction.LoadComplete(bubbleArray));
            } else {
                console.log('received get_bubble_list fail');
                this._store.dispatch(new BubbleAction.LoadError(body));
            }
        } else if (command === 'create_bubble') {
            if (accept === 'True') {
                //if (body.who === ) {
                const bubble = new BubbleJsonHelper.getBubbleObject(String(body));
                // get parent bubble from body.parent_bubble
                //this._store.dispatch(new BubbleAction.CreateComplete(bubble));
                //} else {
                //}
                // change bubbleslist and push it into appropriate Subject<Bubble>
                console.log('received create_bubble success');
            } else {
                this._store.dispatch(new BubbleAction.CreateError(body));
                console.log('received create_bubble fail');
            }
        } else if (command === 'create_suggest_bubble') {
            if (accept === 'True') {
                console.log('received create_suggest_bubble success');
            } else {
                console.log('received create_suggest_bubble fail');
            }
        } else if (command === 'edit_bubble') {
            if (accept === 'True') {
                console.log('received edit_bubble success');
            } else {
                console.log('received edit_bubble fail');
            } 
        } else if (command === 'finish_editting_bubble') {
            if (accept === 'True') {
            } else {

            }
        } else if (command == 'pop_bubble') {
            if (accept == 'True') {
                console.log('received pop_bubble success');
                this._store.dispatch(new BubbleAction.PopComplete(body.bubble_id));
            } else {
                console.log('received pop_bubble fail');
                this._store.dispatch(new BubbleAction.PopError(body));
            }
        }
    }

    public openDocument(documentId): Promise<void> {
        const m = {'header': 'open_document',
                'body': {'document_id': documentId}};
        console.log('send open_document');
        this._socket.send(m);
        return Promise.resolve(null);
    }

    public closeDocument(documentId) {
        const m = {'header': 'close_document',
                'body': {'document_id': documentId}};
        this._socket.send(m);
    }

    public getBubbleList() {
        const m = {'header': 'get_bubble_list',
                'body': {'empty': 'empty'}};
        this._socket.send(m);
    }

    public getSuggestBubbleList(){
    }

    public getCommentListForBubble(){
    }

    public getCommentListForSuggestBubble(){
    }

    public createBubbleMine(parentId: number, loc: number, content: string) {
        // parent: parent bubble id (int)
        // location: nth child (0 ~ #currentchildbubble) (int)
        // content: (string)
        const m = {'header': 'create_bubble',
            'body': {'parent': parentId,
                'location': loc,
                'content': content}};
        this._socket.send(m);
    }

    public createSuggestBubble(bindedBubbleId: number, content: string){
        const m = {'header': 'create_suggest_bubble',
            'body': {'binded_bubble': bindedBubbleId,
                'content': content}};
        this._socket.send(m);
    }

    public createCommentOnNormalBubble(){
    }

    public createCommentOnSuggestBubble(){
    }

    public async startEditBubble(bubble: Bubble): Promise<void> {
        const m = {'header': 'edit_bubble',
            'body': {'bubble_id': bubble.id}};
        this._socket.send(m);
        return Promise.resolve(null);
    }

    public edittingBubble(){
        // TODO: back is working....
    }

    public finishEdittingBubble(bubble_id: number){
        const m = {'header': 'finish_editting_bubble',
            'body': {'bubble_id': bubble_id}};
        this._socket.send(m);
    }

    public async deleteBubble(bubble_id: number): Promise<void> {
        const m = {'header': 'delete_bubble',
            'body': {'bubble_id': bubble_id}};
        return Promise.resolve(null);
    }
    
    public deleteSuggestBubble(){
    }

    public async wrapBubble(wrapBubbleList: Array<Bubble>): Promise<void> {
        if (wrapBubbleList.length <= 1) {
            throw new Error('Cannot wrap one bubble');
        }
        await this.delay(1000);
        return Promise.resolve(null);
    }

    public async mergeBubble(bubble: Bubble): Promise<void> {
        await this.delay(1000);
        return Promise.resolve(null);
    }

    public async splitLeafBubble(bubble_id: number, content_list: Array<String>): Promise<void> {
        const m = {'header': 'split_leaf_bubble',
            'body': {'bubble_id': bubble_id,
                'content_list': [...content_list]}};
        this._socket.send(m);
        return Promise.resolve(null);
    }

    public async flattenBubble(bubble: Bubble): Promise<Bubble> {
        await this.delay(1000);
        return Promise.resolve(new LeafBubble(this._getTempBubbleId()));
    }

    public async popBubble(bubble: Bubble): Promise<void> {
        const m = {'header': 'pop_bubble',
            'body': {'bubble_id': bubble.id}};
        this._socket.send(m);
        return Promise.resolve(null);
    }

    public async createBubble(bubble: Bubble, isAbove: boolean): Promise<Bubble> {
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
