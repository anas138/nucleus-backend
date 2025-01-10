import { IsNotEmpty, IsString } from 'class-validator';

export class GetSingleByParamsDto {
  @IsString()
  @IsNotEmpty()
  alarm_name: string;

  @IsString()
  @IsNotEmpty()
  severity: string;
}
