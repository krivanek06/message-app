import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule],
  template: 'TODO chat',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ChatRoomComponent {}
