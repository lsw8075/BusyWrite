import { ServerSocket } from './websocket.service';
import { async, TestBed } from '@angular/core/testing';
import { BubbleService } from './bubble.service';

import { Store, StoreModule } from '@ngrx/store';

describe('ServerSocket', () => {
    let service: ServerSocket;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
          imports: [
          ],
          providers: [
            ServerSocket,
            BubbleService,
            Store
          ]
        })
        .compileComponents();
      }));

    beforeEach(() => {
    });

    it('connect', () => {
    });

});
