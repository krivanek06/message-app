import { MessageCreate } from '@shared-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * DTO for creating a message
 */
export class MessageCreateDTO implements MessageCreate {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

/**
 * DTO for searching past messages
 */
export class MessageSearchDTO {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  offset: number;
}
