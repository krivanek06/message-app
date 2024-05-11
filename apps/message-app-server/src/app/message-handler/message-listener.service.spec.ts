import { Test } from '@nestjs/testing';
import { ApplicationUser, MessageChat } from '@shared-types';
import { when } from 'jest-when';
import { AppDatabaseService } from '../database';
import { MessageListenerService } from './message-listener.service';

describe('MessageListenerService', () => {
  let service: MessageListenerService;

  let appDatabaseServiceMock: Pick<
    jest.MockedObject<AppDatabaseService>,
    'addUser' | 'addMessage' | 'getMessages' | 'deactivateUser'
  >;

  let mockWebSocketServer: any;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        MessageListenerService,
        {
          provide: AppDatabaseService,
          useValue: {
            addUser: jest.fn(),
            addMessage: jest.fn(),
            getMessages: jest.fn(),
            deactivateUser: jest.fn(),
          },
        },
        {
          provide: 'WebSocketServer',
          useValue: {
            on: jest.fn(),
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = modRef.get(MessageListenerService);
    appDatabaseServiceMock = modRef.get(AppDatabaseService);

    mockWebSocketServer = modRef.get('WebSocketServer'); // Get mock WebSocketServer
    service.server = mockWebSocketServer; // Assign mockWebSocketServer to service.server
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call onModuleInit', () => {
    service.onModuleInit();

    expect(service.server.on).toHaveBeenCalled();
    expect(service.server.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('should create and emit message on onNewMessage', async () => {
    const message = {
      userId: 'test',
      content: 'test',
    };

    const newMessage = {
      userId: 'test',
      content: 'test',
    } as MessageChat;

    when(appDatabaseServiceMock.addMessage).calledWith(message).mockResolvedValue(newMessage);
    when(appDatabaseServiceMock.getMessages).calledWith(0, 99999).mockResolvedValue([newMessage]);

    await service.onNewMessage(message);

    expect(appDatabaseServiceMock.addMessage).toHaveBeenCalledWith(message);
    expect(mockWebSocketServer.emit).toHaveBeenCalledWith('onMessage', newMessage);
  });

  it('should create and emit user on joinChat', async () => {
    const appUser = {
      username: 'test',
      imageUrl: 'test',
    };

    const newUser = {
      username: 'test',
      imageUrl: 'test',
    } as ApplicationUser;

    when(appDatabaseServiceMock.addUser).calledWith(appUser).mockResolvedValue(newUser);

    await service.onUserJoinChat(appUser);

    expect(appDatabaseServiceMock.addUser).toHaveBeenCalledWith(appUser);
    expect(mockWebSocketServer.emit).toHaveBeenCalledWith('onUser', newUser);
  });

  it('should deactivate user on leaveChat', async () => {
    const appUser = {
      userId: 'test',
      username: 'test',
      imageUrl: 'test',
    } as ApplicationUser;

    await service.onUserLeftChat(appUser);

    expect(appDatabaseServiceMock.deactivateUser).toHaveBeenCalledWith(appUser.userId);
    expect(mockWebSocketServer.emit).toHaveBeenCalledWith('onUser', appUser);
  });
});
