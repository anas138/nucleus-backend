import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class GetGlobalSettingsBySinglECondition {
  @IsOptional()
  @IsNumber()
  global_setting_type_id: number;

  @IsOptional()
  @MaxLength(255)
  condition_value: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  key: string;
}
