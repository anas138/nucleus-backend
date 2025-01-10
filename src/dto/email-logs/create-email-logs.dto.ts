import { IsOptional, IsString } from 'class-validator';

export class CreateEmailLogsDto {
  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  to: string;

  @IsOptional()
  @IsString()
  cc: string;

  @IsOptional()
  @IsString()
  html_body: string;

  @IsOptional()
  @IsString()
  from: string;
}
