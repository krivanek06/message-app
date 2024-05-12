import { faker } from '@faker-js/faker';
import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { ApplicationUser, ApplicationUserCreate, MessageCreate } from '@shared-types';
import { AppDatabaseService } from './database';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private appDatabaseService: AppDatabaseService) {}

  @Get()
  getData() {
    return 'App is running!';
  }

  // create some initial data
  async onModuleInit() {
    // create N random users
    const appUsers: ApplicationUser[] = [];

    for (let i = 0; i < 20; i++) {
      const data = {
        username: faker.internet.userName(),
        imageUrl: faker.image.avatar(),
      } satisfies ApplicationUserCreate;

      // add user to the DB
      const createdUser = await this.appDatabaseService.addUser(data);

      // save user
      appUsers.push(createdUser);
    }

    // create N random messages for each user randomly
    for (let i = 0; i < 20; i++) {
      for (const user of appUsers) {
        const data = {
          userId: user.userId,
          content: faker.lorem.paragraph({ min: 1, max: 3 }),
        } satisfies MessageCreate;

        // add message to the DB
        await this.appDatabaseService.addMessage(data);
      }
    }

    // deactivating some users
    for (let i = 0; i < 7; i++) {
      await this.appDatabaseService.deactivateUser(appUsers[i].userId);
    }

    console.log('Initial data created');
    console.log('user', (await this.appDatabaseService.getUserByUsername('')).length);
    console.log('messages', (await this.appDatabaseService.getMessages(0, 99999)).length);
  }
}
