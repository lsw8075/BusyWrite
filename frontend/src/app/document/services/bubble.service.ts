import { Injectable } from '@angular/core';
import { MockBubbleRoot, MockBubbleList } from '../models/bubble.mock';
import { Bubble, LeafBubble, InternalBubble, SuggestBubble, BubbleType } from '../models/bubble';
import { Subscription } from 'rxjs/Subscription';
import { ServerSocket } from './websocket.service';

import { Store } from '@ngrx/store';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { MenuType } from './event/event-bubble.service';

import * as Reducer from '../reducers/reducer';
import * as BubbleAction from '../actions/bubble-action';

let USE_MOCK = true;
let Id = 30; // to be deleted after backend implemented
const UserId = 1;

@Injectable()
export class BubbleService {

    private socketSubscription: Subscription;
    private currentDocumentId: Number;
    private bubbleList: Array<Bubble> = [];
    private bubbleRoot: InternalBubble;

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

        /* Test purpose */
        this.openDocument(1);
        this.getBubbleListMine();
        this._createBubble(1, 0, 'this is new bubble');
        this.closeDocument(1);

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
                // call whatever action that starts up document_detail page setting
            } else {
                console.log('received open_document fail');
                // call whatever funtion that waits to start up document_detail page
                // and let it know it has failed
            }
        } else if (command === 'close_document') {
            if (accept === 'True') {
                console.log('received close_document success');
                this.currentDocumentId = 0;
            } else {

                console.log('received close_document fail');
                // TODO: decide whether to send it again or not
            }
        } else if (command === 'get_bubble_list') {
            if (accept === 'True') {
                // TODO: convert content into bubble list
                //this._store.dispatch(new BubbleAction.LoadComplete(bubble))
                //this.bubbleList = body.content;
                console.log('received get_bubble_list success');
                console.log(body.content);

            } else {
                // TODO: decide what to do
                console.log('received get_bubble_list fail');
            }
        } else if (command === 'create_bubble') {
            if (accept === 'True') {
                // change bubbleslist and push it into appropriate Subject<Bubble>
                console.log('received create_bubble success');
            } else {

                console.log('received create_bubble fail');
                // TODO: if it is THIS user that has sent the request,
                // (need to distinguish!!! maybe we need to add user_id field)
                // tell user it has failed by calling whatever function
            }
        }
    }

    public openDocument(documentId): Promise<void> {
        const m = {'header': 'open_document',
                'body': {'document_id': documentId.toString()}};
        console.log('send open_document');
        this._socket.send(m);
        return Promise.resolve(null);
    }

    public closeDocument(documentId) {
        const m = {'header': 'close_document',
                'body': {'document_id': documentId.toString()}};
        this._socket.send(m);
    }

    public getBubbleListMine() {
        const m = {'header': 'get_bubble_list',
                'body': {'empty': 'empty'}};
        this._socket.send(m);
    }

    public _createBubble(parentId: number, loc: number, content: string) {
        const m = {'header': 'create_bubble',
                'body': {'parent': parentId.toString(),
                'location': loc.toString(),
                'content': content}};
        this._socket.send(m);
    }

  public getBubbleList(): Promise<Array<Bubble>> {

    return Promise.resolve(this.bubbleList);
  }

    public getBubbleById(id: number): Bubble {
        if (0 < id) {
            for (const bubble of this.bubbleList) {
                if (bubble.id === id) {
                    return bubble;
                }
            }
        }
        throw new Error('bubble with index ' + id + ' does not exist');
    }

  public async editBubble(bubble: Bubble): Promise<void> {
    if (bubble.type !== BubbleType.leafBubble) {
      throw new Error('Cannot edit internal bubble');
    }
    console.log('[edit]');
    await this.delay(1000);
    return Promise.resolve(null);
  }

  public async deleteBubble(bubble: Bubble): Promise<void> {
    // if (bubble.parentBubble === null) {
    //   throw new Error('Cannot delete root bubble');
    // }
    await this.delay(1000);
    return Promise.resolve(null);
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

  public async splitBubble(bubble: Bubble): Promise<void> {
    await this.delay(1000);
    return Promise.resolve(null);
  }

  public async popBubble(bubble: Bubble): Promise<void> {
    // check the assumptions
    // if (bubble.parentBubble === null) {
    //   throw new Error('Cannot pop root bubble');
    // }
    await this.delay(1000);
    return Promise.resolve(null);
  }


  private _getBubbleList(): Promise<Array<Bubble>> {
    this.bubbleRoot = MockBubbleRoot;
    return Promise.resolve(MockBubbleList);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
