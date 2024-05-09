import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AppDatabaseService } from '../database';
import { ApplicationUserCreateDTO, ApplicationUserDTO } from '../user-handler/user-handler.dto';
import { MessageCreateDTO } from './message-handler.dto';

@WebSocketGateway({ cors: true })
export class MessageListenerService implements OnModuleInit {
  constructor(private appDatabaseService: AppDatabaseService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('joinChat')
  async onUserJoinChat(@MessageBody() appUser: ApplicationUserCreateDTO) {
    // add user to the DB
    const newUser = await this.appDatabaseService.addUser(appUser);

    // notify all clients
    this.server.emit('onUser', newUser);
  }

  @SubscribeMessage('leaveChat')
  async onUserLeftChat(@MessageBody() appUser: ApplicationUserDTO) {
    // add user to the DB
    const newUser = await this.appDatabaseService.deactivateUser(appUser.userId);

    // notify all clients
    this.server.emit('onUser', newUser);
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() message: MessageCreateDTO) {
    // add message to the DB
    const newMessage = await this.appDatabaseService.addMessage(message);

    // notify all clients
    this.server.emit('onMessage', newMessage);
  }
}
