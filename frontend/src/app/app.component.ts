import { Component } from '@angular/core';
import { BubbleService } from './service/bubble.service';
import { WebsocketInternalService, WebsocketService } from './service/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ WebsocketInternalService, WebsocketService, BubbleService ],
})
export class AppComponent {
  title = 'app';

  constructor(private bubbleService: BubbleService) {}
}
