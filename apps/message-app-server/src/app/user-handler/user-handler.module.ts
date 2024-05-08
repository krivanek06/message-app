import { Module } from '@nestjs/common';
import { AppDatabaseService } from '../database';
import { UserHandlerController } from './user-handler.controller';

@Module({
  providers: [AppDatabaseService],
  controllers: [UserHandlerController],
})
export class UserHandlerModule {}
