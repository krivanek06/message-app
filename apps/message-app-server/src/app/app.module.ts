import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { MessageHandlerModule } from './message-handler';
import { UserHandlerModule } from './user-handler';

@Module({
  imports: [MessageHandlerModule, UserHandlerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
