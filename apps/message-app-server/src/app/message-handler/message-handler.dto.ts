import { MessageCreate } from '@shared-types';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => {
    return Number(value);
  })
  limit?: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  offset: number;
}

export class MessageSearchByUserIdDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
