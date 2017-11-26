import { Component } from '@angular/core';
import { BubbleService } from './service/bubble.service';
import { ServerSocket } from './service/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ServerSocket, BubbleService ],
})
export class AppComponent {
  title = 'app';

  constructor(private bubbleService: BubbleService) {}
}
