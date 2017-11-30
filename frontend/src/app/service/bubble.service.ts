import { Injectable } from '@angular/core';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../model/bubble';
import { MockBubbleRoot, MockBubbleList } from '../model/bubble.mock';
import { Subscription } from 'rxjs/Subscription';
import { ServerSocket } from './websocket.service';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

let USE_MOCK = true;
let tempId = 30; // to be deleted after backend implemented

@Injectable()
export class BubbleService {

    private socketSubscription: Subscription;
    private currentDocumentId: Number;
    private bubbleList: Array<Bubble> = [];
    private bubbleRoot: InternalBubble;

    constructor(private socket: ServerSocket, private http: Http)  {
        /* TODO: decide whether it's better to connect the user all time
                 (a.k.a. connect socket at constructor())
                 or to connect when user opens document-detail page
                 and disconnect when user closes document-detail page
                 (a.k.a. connect socket at openDocument()) */
        const stream = this.socket.connect();

        this.socketSubscription = stream.subscribe(message => {
                console.log('recevied message from server: ', message)
                this.channelMessageHandler(message);
        });

        /* Test purpose */
        this.http.post('api/signin', JSON.stringify({'username': 'swpp', 'password': 'swpp'}), {headers: new Headers({'Content-Type': 'application/json'})})
            .toPromise()
            .then(() => { 
                this.openDocument(1);
                this.getBubbleList();
                this._createBubble(1, 0, 'this is new bubble');
                this.closeDocument(1);
            }
        );

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
    
        let data = JSON.parse(msg);
        // TODO: check if data has appropriate elements
        let command = data.header;
        let accept = data.accept;
        let body = data.body;

        if (command === 'open_document') {
            if (accept === 'True') {
                console.log('received open_document success');
                this.currentDocumentId = Number(body.document_id);
                // call whatever function that starts up document_detail page setting
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
    
    public openDocument(documentId) {
        const m: string  = JSON.stringify({'text':
                {'header': 'open_document', 
                'body': {'document_id': documentId.toString()}}});
        console.log('send open_document');
        this.socket.send(m);
    }

    public closeDocument(documentId) {
        const m: string = JSON.stringify({'text':
                {'header': 'close_document', 
                'body': {'document_id': documentId.toString()}}});
        this.socket.send(m);
    }

    public getBubbleList() {
        const m: string = JSON.stringify({'text':
                {'header': 'get_bubble_list',
                'body': {'empty': 'empty'}}});
        this.socket.send(m);
    }

    public _createBubble(parentId: number, loc: number, content: string) {
        const m: string = JSON.stringify({'text':
                {'header': 'create_bubble',
                'body': {'parent': parentId.toString(), 
                'location': loc.toString(),
                'content': content}}});
        this.socket.send(m);
    }

    public getRootBubble(): Promise<Bubble> {
        return Promise.resolve(this.bubbleRoot);
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
    const tempUserId = 1;
    const newBubble = new LeafBubble(this._getId(), content, tempUserId);
    parentBubble.insertChildren(location, newBubble);
    return Promise.resolve(newBubble);
  }


  public editBubble(bubble: Bubble, newContent: string): Promise<void> {
    if (bubble.type === BubbleType.leafBubble) {
      (bubble as LeafBubble).content = newContent;
      (bubble as LeafBubble).releaseLock();
      return Promise.resolve(null);
    } else {
      throw new Error('Cannot edit internal bubble');
    }
  }

  public deleteBubble(bubble: Bubble): Promise<void> {
    if (bubble.parentBubble === null) {
      throw new Error('Cannot delete root bubble');
    }
    const parentBubble: InternalBubble = bubble.parentBubble;
    parentBubble.deleteChild(bubble);

    const deleteBubbleList = [];
    this._getChildrenList(bubble, deleteBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, deleteBubbleList));

    return Promise.resolve(null);
  }

  public wrapBubble(wrapBubbleList: Array<Bubble>): Promise<void> {
    const parentBubble: InternalBubble = wrapBubbleList[0].parentBubble;
    const wrapperBubble = parentBubble.wrapChildren(wrapBubbleList);
    this.bubbleList = this.bubbleList.filter(b => !this._containsBubble(b, wrapBubbleList));
    this.bubbleList.push(wrapperBubble);
    return Promise.resolve(null);
  }

  public popBubble(bubble: Bubble): Promise<void> {
    // check the assumptions
    if (bubble.parentBubble === null) {
      throw new Error('Cannot pop root bubble');
    }

    const parentBubble: InternalBubble = bubble.parentBubble;
    parentBubble.popChild(bubble);
    this.bubbleList = this.bubbleList.filter(b => b.id !== bubble.id);

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

    const currBubble: LeafBubble = new LeafBubble(this._getId(), selectContent);
    splittedChildren.push(currBubble);

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

}

