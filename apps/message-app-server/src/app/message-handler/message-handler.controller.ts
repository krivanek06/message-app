import { BadRequestException, Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageChat } from '@shared-types';
import { AppDatabaseService } from '../database';
import { MessageSearchDTO } from './message-handler.dto';

@Controller('message')
export class MessageHandlerController {
  constructor(private appDatabaseService: AppDatabaseService) {}

  @Get('/all')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => new BadRequestException('Validation failed, missing limit or offset'),
    }),
  )
  async getMessagesAll(@Query() query: MessageSearchDTO): Promise<MessageChat[]> {
    return this.appDatabaseService.getMessages(query.offset, query.limit);
  }
}
