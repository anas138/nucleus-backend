import { IsEmail, IsNotEmpty, IsObject } from 'class-validator';

export class AuthMsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsObject()
  msalLoginResponse: any;
}
