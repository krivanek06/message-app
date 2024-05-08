import { Module } from '@nestjs/common';
import { AppDatabaseService } from '../database';
import { MessageHandlerController } from './message-handler.controller';
import { MessageListenerService } from './message-listener.service';

@Module({
  providers: [MessageListenerService, AppDatabaseService],
  controllers: [MessageHandlerController],
})
export class MessageHandlerModule {}
