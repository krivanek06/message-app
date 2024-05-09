import { Injectable } from '@angular/core';
import { ApplicationUserCreate, MessageCreate } from '@shared-types';
import { Socket } from 'ngx-socket-io';
import { bufferTime, tap } from 'rxjs';
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

  sendJoinChat(user: ApplicationUserCreate) {
    this.emit('joinChat', user);
  }

  sendLeaveChat(user: ApplicationUserCreate) {
    this.emit('leaveChat', user);
  }

  listenOnNewMessage() {
    this.fromEvent('newMessage').pipe(
      // buffer messages for 1 second - to avoid spamming
      bufferTime(1000),
      tap((x) => console.log('newMessage', x)),
    );
  }

  listenOnNewUser() {
    this.fromEvent('onUser').pipe(tap((x) => console.log('onUser', x)));
  }
}
