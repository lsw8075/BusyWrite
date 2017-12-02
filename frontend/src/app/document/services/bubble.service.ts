import { Injectable } from '@angular/core';
import { BubbleTemp, BubbleType, LeafBubble, InternalBubbleTemp, SuggestBubble } from '../models/bubble-temp';
import { MockBubbleRoot, MockBubbleList } from '../models/bubble.mock';
import { Subscription } from 'rxjs/Subscription';
import { ServerSocket } from './websocket.service';

import { Store } from '@ngrx/store';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { MenuType } from './event/event-bubble.service';

import * as Reducer from '../reducers/reducer';
import * as BubbleAction from '../actions/bubble-action';

let USE_MOCK = true;
let tempId = 30; // to be deleted after backend implemented
const tempUserId = 1;

@Injectable()
export class BubbleService {

    private socketSubscription: Subscription;
    private currentDocumentId: Number;
    private bubbleList: Array<BubbleTemp> = [];
    private bubbleRoot: InternalBubbleTemp;

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
                // change bubbleslist and push it into appropriate Subject<BubbleTemp>
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

  public getBubbleList(): Promise<Array<BubbleTemp>> {
    return Promise.resolve(this.bubbleList);
  }

    public getBubbleById(id: number): BubbleTemp {
        if (0 < id) {
            for (const bubble of this.bubbleList) {
                if (bubble.id === id) {
                    return bubble;
                }
            }
        }
        throw new Error('bubble with index ' + id + ' does not exist');
    }

  public createBubble(parentBubble: InternalBubbleTemp, location: number, content: string): Promise<BubbleTemp> {
    const newBubble = new LeafBubble(this._getId(), content, tempUserId);
    parentBubble.insertChildren(location, newBubble);
    return Promise.resolve(newBubble);
  }


  public async editBubble(bubble: BubbleTemp): Promise<void> {
    if (bubble.type !== BubbleType.leafBubble) {
      throw new Error('Cannot edit internal bubble');
    }
    console.log('[edit]');
    await this.delay(1000);
    return Promise.resolve(null);
  }

  public async deleteBubble(bubble: BubbleTemp): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot delete root bubble');
    }
    await this.delay(1000);
    return Promise.resolve(null);
  }

  public async wrapBubble(wrapBubbleList: Array<BubbleTemp>): Promise<void> {
    if (wrapBubbleList.length <= 1) {
      throw new Error('Cannot wrap one bubble');
    }
    await this.delay(1000);
    return Promise.resolve(null);
  }

  public async mergeBubble(bubble: BubbleTemp): Promise<void> {
    await this.delay(1000);
    return Promise.resolve(null);
  }

  public async splitBubble(bubble: BubbleTemp): Promise<void> {
    await this.delay(1000);
    return Promise.resolve(null);
  }

  public async popBubble(bubble: BubbleTemp): Promise<void> {
    // check the assumptions
    if (bubble.parentBubble === null) {
      throw new Error('Cannot pop root bubble');
    }
    await this.delay(1000);
    return Promise.resolve(null);
  }

  // split Leaf bubble
  public splitLeafBubble(bubble: BubbleTemp, selectContent: string, startIndex: number): Promise<void> {
    const originalContent = bubble.getContent();

    if (originalContent.indexOf(selectContent) === -1) {
      throw new Error(`selected content not found in bubble (id: ${bubble.id})`);
    }
    const endIndex: number = startIndex + selectContent.length;

    const splittedChildren: Array<BubbleTemp> = [];

    if (startIndex !== 0) {
      const prevBubble: LeafBubble = new LeafBubble(this._getId(), originalContent.substring(0, startIndex));
      splittedChildren.push(prevBubble);
    }

    if (selectContent) {
      const currBubble: LeafBubble = new LeafBubble(this._getId(), selectContent);
      splittedChildren.push(currBubble);
    }

    if (endIndex !== originalContent.length - 1) {
      const nextBubble: LeafBubble = new LeafBubble(this._getId(), originalContent.substring(endIndex, originalContent.length));
      splittedChildren.push(nextBubble);
    }

    const wrapBubble = new InternalBubbleTemp(this._getId(), splittedChildren);

    const parentBubble: InternalBubbleTemp = bubble.parentBubble;
    const location = bubble.location;
    parentBubble.deleteChild(bubble);
    this.bubbleList = this.bubbleList.filter(b => b.id !== bubble.id);
    parentBubble.insertChildren(location, wrapBubble);
    this.bubbleList.push(...splittedChildren);

    return Promise.resolve(null);
  }

  public flattenBubble(bubble: BubbleTemp): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot flatten root bubble');
    }
    const parentBubble: InternalBubbleTemp = bubble.parentBubble;
    const flattenedBubble = parentBubble.flattenChild(bubble);
    this.bubbleList.push(flattenedBubble);

    const wrapBubbleList = [];
    this._getChildrenList(bubble, wrapBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, wrapBubbleList));

    return Promise.resolve(null);
  }

  public moveBubble(bubble: BubbleTemp, destBubble: BubbleTemp, menu: MenuType): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot move root bubble');
    } else if (bubble.id !== destBubble.id) {
      const parentBubble: InternalBubbleTemp = bubble.parentBubble;
      parentBubble.deleteChild(bubble);

      let location = destBubble.location;
      if (menu === MenuType.borderBottomMenu) {
        location ++;
      }
      destBubble.parentBubble.insertChildren(location, bubble);

    }
    return Promise.resolve(null);
  }

  public switchBubble(bubble: BubbleTemp, suggestBubble: SuggestBubble): BubbleTemp {
    const newSB = new SuggestBubble(this._getId(), bubble.getContent(), bubble.comments, bubble.thumbUps);
    if (bubble.type === BubbleType.leafBubble) {
      let leafBubble = bubble as LeafBubble;

      leafBubble.thumbUps = suggestBubble.thumbUps;
      leafBubble.comments = suggestBubble.comments;
      leafBubble.content = suggestBubble.content;

      leafBubble.deleteSuggestBubble(suggestBubble);
      leafBubble.addSuggestBubble(newSB);

      return leafBubble;
    }
    else if(bubble.type === BubbleType.internalBubble) {
      let internalBubble = bubble as InternalBubbleTemp;
      let parentBubble = internalBubble.parentBubble;
      let leafBubble = new LeafBubble(this._getId());

      leafBubble.thumbUps = suggestBubble.thumbUps;
      leafBubble.comments = suggestBubble.comments;
      leafBubble.content = suggestBubble.content;
      leafBubble.suggestBubbles = internalBubble.suggestBubbles;

      leafBubble.deleteSuggestBubble(suggestBubble);
      leafBubble.addSuggestBubble(newSB);

      parentBubble.childBubbles[internalBubble.location] = leafBubble;

      return leafBubble;
    }
  }

  private _getBubbleList(): Promise< Array<BubbleTemp> > {
    this.bubbleRoot = MockBubbleRoot;
    return Promise.resolve(MockBubbleList);
  }

  private _containsBubble(bubble: BubbleTemp, bubbleList: Array<BubbleTemp>): boolean {
    for (const b of this.bubbleList) {
      if (b.id === bubble.id) {
        return true;
      }
    }
    return false;
  }

  private _getChildrenList(bubble: BubbleTemp, childrenList: Array<BubbleTemp>): void {
    bubble.id = -1; // this is check later if a bubble is not properly erased
    childrenList.push(bubble);
    if (bubble.type !== BubbleType.leafBubble) {
      const children = (bubble as InternalBubbleTemp).childBubbles;
      for (const child of children) {
        this._getChildrenList(child, childrenList);
      }
    }
  }

  private _getId(): number {
    tempId++;
    return tempId;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
