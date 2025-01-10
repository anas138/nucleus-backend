import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  isURL,
} from 'class-validator';
import { UserType } from 'src/common/enums/enums';
import { AuditDto } from '../audit.dto';

export class UpdateUserDto extends AuditDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Passwor is weak',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  profile_picture: string;

  @IsNotEmpty()
  @IsMobilePhone()
  personal_mobile: string;

  @IsNotEmpty()
  @IsMobilePhone()
  official_mobile: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  role_ids: number[];

  @IsNotEmpty()
  @IsNumber()
  designation_id: number;

  @IsNotEmpty()
  @IsNumber()
  department_id: number;

  @IsOptional()
  @IsNumber()
  sub_department_id: number;

  @IsNotEmpty()
  @IsEnum(UserType)
  user_type: UserType;

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
