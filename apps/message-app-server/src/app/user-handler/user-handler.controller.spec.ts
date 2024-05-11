import { Test } from '@nestjs/testing';
import { ApplicationUser, ApplicationUserSearch } from '@shared-types';
import { when } from 'jest-when';
import { AppDatabaseService } from '../database';
import { UserHandlerController } from './user-handler.controller';

describe('UserHandlerController', () => {
  let controller: UserHandlerController;

  let appDatabaseServiceMock: Pick<
    jest.MockedObject<AppDatabaseService>,
    'getUserByUsername' | 'getLastActiveUsers' | 'addUser'
  >;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [UserHandlerController],
      providers: [
        {
          provide: AppDatabaseService,
          useValue: {
            getUserByUsername: jest.fn(),
            getLastActiveUsers: jest.fn(),
            addUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = modRef.get(UserHandlerController);
    appDatabaseServiceMock = modRef.get(AppDatabaseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getUserByUsername', () => {
    const search = 'test';

    controller.getUserByUsername(search);

    expect(appDatabaseServiceMock.getUserByUsername).toHaveBeenCalledWith(search);
  });

  it('should call getLastActiveUser', () => {
    controller.getLastActiveUser();

    expect(appDatabaseServiceMock.getLastActiveUsers).toHaveBeenCalled();
  });

  it('should call createUser', async () => {
    const createUserMock = {
      username: 'test',
      isActive: true,
      lastActiveTimestamp: Date.now(),
    } as ApplicationUserSearch;

    const createdUserMock = {
      ...createUserMock,
    } as ApplicationUser;

    when(appDatabaseServiceMock.addUser).calledWith(createUserMock).mockResolvedValue(createdUserMock);

    const result = await controller.createUser(createUserMock);

    expect(appDatabaseServiceMock.addUser).toHaveBeenCalledWith(createUserMock);
    expect(result).toEqual(createdUserMock);
  });
});
