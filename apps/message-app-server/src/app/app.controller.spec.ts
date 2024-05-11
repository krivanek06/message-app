import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppDatabaseService } from './database';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppDatabaseService,
          useValue: {
            addUser: jest.fn(),
            addMessage: jest.fn(),
            deactivateUser: jest.fn(),
            getMessages: jest.fn(),
            getMessagesByUserId: jest.fn(),
            getUserByUsername: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    const controller = app.get<AppController>(AppController);
    expect(controller).toBeDefined();
  });
});
