import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import { Observable } from 'rxjs/Observable';
import { WebSocketService } from 'angular2-websocket-service';
import 'rxjs/add/operator/share';

/* reference: www.npmjs.com/package/angular2-websocket-service */
@Injectable()
export class ServerSocket {

    private inputStream: QueueingSubject<String>;
    public outputStream: Observable<String>;

    constructor(private socketFactory: WebSocketService) {}

    public connect() {
        if (this.outputStream) {
            return this.outputStream;
        }

        return this.outputStream = this.socketFactory.connect(
                'ws://localhost:8000',
                this.inputStream = new QueueingSubject<String>()
        ).share();
    }

    public send (message: String): void {
        this.inputStream.next(message);
    }
}
