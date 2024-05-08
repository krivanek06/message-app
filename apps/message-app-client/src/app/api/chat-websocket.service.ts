import { Injectable } from '@angular/core';
import { MessageCreate } from '@shared-types';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ChatWebSocket extends Socket {
  constructor() {
    super({
      url: environment.serverWSEndpoint,
      options: {},
    });

    console.log('ChatWebSocket created!');
  }

  sendNewMEssage(message: MessageCreate) {
    this.emit('newMessage', message);
  }

  listenOnNewMessage() {
    this.fromEvent('newMessage').pipe(tap((x) => console.log('newMessage', x)));
  }
}
