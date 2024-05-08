import { Body, Controller, Get, Optional, Post, Query } from '@nestjs/common';
import { AppDatabaseService } from '../database';
import { ApplicationUserCreateDTO } from './user-handler.dto';

@Controller('user')
export class UserHandlerController {
  constructor(private appDatabaseService: AppDatabaseService) {}

  @Get('/')
  getUserByUsername(@Optional() @Query('search') search?: string) {
    return this.appDatabaseService.getUserByUsername(search || '');
  }

  @Get('/last-active')
  getLastActiveUser() {
    return this.appDatabaseService.getLastActiveUsers();
  }

  @Post('/')
  createUser(@Body() createUser: ApplicationUserCreateDTO) {
    console.log('createUser', createUser);
    return this.appDatabaseService.addUser(createUser);
  }
}
