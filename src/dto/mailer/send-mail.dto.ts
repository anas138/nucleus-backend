import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc_recipients: Array<string>;

  @IsOptional()
  @IsString()
  template: string;
}
