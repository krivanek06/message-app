import { Injectable } from '@angular/core';
import { ApplicationUserCreate, MessageChat, MessageCreate } from '@shared-types';
import { Socket } from 'ngx-socket-io';
import { Observable, bufferTime, filter, tap } from 'rxjs';
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

  listenOnNewMessage(): Observable<MessageChat[]> {
    return this.fromEvent<MessageChat>('onMessage').pipe(
      tap((x) => console.log('onMessage', x)),
      // buffer messages for 1 second - to avoid spamming
      bufferTime(500),
      filter((x) => x.length > 0),
    );
  }

  listenOnNewUser() {
    this.fromEvent('onUser').pipe(tap((x) => console.log('onUser', x)));
  }
}
