import { Injectable } from '@angular/core';
import { Bubble, BubbleType, LeafBubble, InternalBubble, SuggestBubble } from '../models/bubble';
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
            } else {
                console.log('received close_document fail');
                // TODO: decide whether to send it again or not
            }
        } else if (command === 'get_bubble_list') {
            if (accept === 'True') {
                console.log('received get_bubble_list success');
                console.log(body.content);
                // TODO: sangjun i believe you 
                // const bubble = (body.content)
                //this._store.dispatch(new BubbleAction.LoadComplete(bubble))
            } else {
                // TODO: decide what to do
                console.log('received get_bubble_list fail');
            }
        } else if (command === 'create_bubble') {
            if (accept === 'True') {
                // if (body.who === )
                // change bubbleslist and push it into appropriate Subject<Bubble>
                console.log('received create_bubble success');
            } else {
                console.log('received create_bubble fail');
                // TODO: if it is THIS user that has sent the request,
                // (need to distinguish!!! maybe we need to add user_id field)
                // tell user it has failed by calling whatever function
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

  public createBubble(parentBubble: InternalBubble, location: number, content: string): Promise<Bubble> {
    const newBubble = new LeafBubble(this._getId(), content, tempUserId);
    parentBubble.insertChildren(location, newBubble);
    return Promise.resolve(newBubble);
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
    if (bubble.parentBubble === null) {
      throw new Error('Cannot delete root bubble');
    }
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
    if (bubble.parentBubble === null) {
      throw new Error('Cannot pop root bubble');
    }
    await this.delay(1000);
    return Promise.resolve(null);
  }

  // split Leaf bubble
  public splitLeafBubble(bubble: Bubble, selectContent: string, startIndex: number): Promise<void> {
    const originalContent = bubble.getContent();

    if (originalContent.indexOf(selectContent) === -1) {
      throw new Error(`selected content not found in bubble (id: ${bubble.id})`);
    }
    const endIndex: number = startIndex + selectContent.length;

    const splittedChildren: Array<Bubble> = [];

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

    const wrapBubble = new InternalBubble(this._getId(), splittedChildren);

    const parentBubble: InternalBubble = bubble.parentBubble;
    const location = bubble.location;
    parentBubble.deleteChild(bubble);
    this.bubbleList = this.bubbleList.filter(b => b.id !== bubble.id);
    parentBubble.insertChildren(location, wrapBubble);
    this.bubbleList.push(...splittedChildren);

    return Promise.resolve(null);
  }

  public flattenBubble(bubble: Bubble): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot flatten root bubble');
    }
    const parentBubble: InternalBubble = bubble.parentBubble;
    const flattenedBubble = parentBubble.flattenChild(bubble);
    this.bubbleList.push(flattenedBubble);

    const wrapBubbleList = [];
    this._getChildrenList(bubble, wrapBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, wrapBubbleList));

    return Promise.resolve(null);
  }

  public moveBubble(bubble: Bubble, destBubble: Bubble, menu: MenuType): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot move root bubble');
    } else if (bubble.id !== destBubble.id) {
      const parentBubble: InternalBubble = bubble.parentBubble;
      parentBubble.deleteChild(bubble);

      let location = destBubble.location;
      if (menu === MenuType.borderBottomMenu) {
        location ++;
      }
      destBubble.parentBubble.insertChildren(location, bubble);

    }
    return Promise.resolve(null);
  }

  public switchBubble(bubble: Bubble, suggestBubble: SuggestBubble): Bubble {
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
      let internalBubble = bubble as InternalBubble;
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

  private _getBubbleList(): Promise< Array<Bubble> > {
    this.bubbleRoot = MockBubbleRoot;
    return Promise.resolve(MockBubbleList);
  }

  private _containsBubble(bubble: Bubble, bubbleList: Array<Bubble>): boolean {
    for (const b of this.bubbleList) {
      if (b.id === bubble.id) {
        return true;
      }
    }
    return false;
  }

  private _getChildrenList(bubble: Bubble, childrenList: Array<Bubble>): void {
    bubble.id = -1; // this is check later if a bubble is not properly erased
    childrenList.push(bubble);
    if (bubble.type !== BubbleType.leafBubble) {
      const children = (bubble as InternalBubble).childBubbles;
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
