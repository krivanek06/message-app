import { ApplicationUser, ApplicationUserCreate } from '@shared-types';
import { IsBoolean, IsDate, IsNotEmpty, IsString, IsUrl } from 'class-validator';

/**
 * DTO for creating an user
 */
export class ApplicationUserCreateDTO implements ApplicationUserCreate {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;
}

export class ApplicationUserDTO implements ApplicationUser {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @IsDate()
  lastActiveTimestamp: number;

  @IsNotEmpty()
  @IsString()
  color: string;
}
