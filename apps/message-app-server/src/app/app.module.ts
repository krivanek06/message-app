import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppDatabaseModule } from './database';
import { MessageHandlerModule } from './message-handler';
import { UserHandlerModule } from './user-handler';

@Module({
  imports: [MessageHandlerModule, UserHandlerModule, AppDatabaseModule],
  controllers: [AppController],
})
export class AppModule {}
