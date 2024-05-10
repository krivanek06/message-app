import { Module } from '@nestjs/common';
import { AppDatabaseModule } from '../database';
import { UserHandlerController } from './user-handler.controller';

@Module({
  imports: [AppDatabaseModule],
  controllers: [UserHandlerController],
})
export class UserHandlerModule {}
