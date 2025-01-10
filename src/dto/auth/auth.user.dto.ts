import {
  IsBoolean,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  full_name: string;

  @IsOptional()
  @IsString()
  profile_picture: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMobilePhone()
  personal_mobile: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMobilePhone()
  official_mobile: string;

  @IsOptional()
  @IsBoolean()
  email_activate: boolean;

  @IsOptional()
  @IsBoolean()
  sms_activate: boolean;

  @IsOptional()
  @IsBoolean()
  notification_activate: boolean;
}
