import { Module } from '@nestjs/common';
import { AppDatabaseModule } from '../database';
import { MessageHandlerController } from './message-handler.controller';
import { MessageListenerService } from './message-listener.service';

@Module({
  imports: [AppDatabaseModule],
  providers: [MessageListenerService],
  controllers: [MessageHandlerController],
})
export class MessageHandlerModule {}
