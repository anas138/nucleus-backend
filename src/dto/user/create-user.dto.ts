import {
  ArrayMinSize,
  IsArray,
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

export class CreateUserDto extends AuditDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
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
  @MaxLength(13)
  personal_mobile: string;

  @IsNotEmpty()
  @IsMobilePhone()
  @MaxLength(13)
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
}
