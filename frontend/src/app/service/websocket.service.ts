import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';

const WS_URL = 'wss://echo.websocket.org/';

export interface Message {
    message: string,
}

@Injectable()
export class WebsocketInternalService {
    
    constructor() {}

    private subject: Rx.Subject<MessageEvent>;

    public connect(url): Rx.Subject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
            console.log("Succesfully connected: " + url);
        }
        return this.subject;
    }

    public create(url): Rx.Subject<MessageEvent> {
        let ws = new WebSocket(url);
        let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);
                return ws.close.bind(ws);
        })
        let observer = {
            next: (data: Object) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(data));
                    }
            }
        }

        return Rx.Subject.create(observer, observable);
    }
}

@Injectable()
export class WebsocketService {

    public messages: Rx.Subject<Message>;

    constructor(private wsiService: WebsocketInternalService) {
        this.messages = <Rx.Subject<Message>> wsiService
            .connect(WS_URL)
            .map((response: MessageEvent): Message => {
                    let data = JSON.parse(response.data);
                    return {
                        message: data
                    }
            });
    }
}

