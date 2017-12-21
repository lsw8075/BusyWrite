import { ServerSocket } from './websocket.service';
import { async, TestBed } from '@angular/core/testing';
import { WebSocketService } from 'angular2-websocket-service';

describe('ServerSocket', () => {
    let service: ServerSocket;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
          imports: [
          ],
          providers: [
            ServerSocket,
            WebSocketService
          ]
        })
        .compileComponents();
      }));

    beforeEach(() => {
        service = new ServerSocket(new WebSocketService());
    });

    it('connect', () => {
        expect(service.connect()).toBeTruthy();
        expect(service.connect()).toBeTruthy();
    });

});
