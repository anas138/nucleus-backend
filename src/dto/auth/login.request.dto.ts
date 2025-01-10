import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class MsLoginRequestDto {
  @IsNotEmpty()
  msalLoginResponse: any;

  @IsNotEmpty()
  @IsString()
  email: string;
}
