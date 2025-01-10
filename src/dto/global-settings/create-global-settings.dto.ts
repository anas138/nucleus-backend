import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RecordStatus } from 'src/common/enums/enums';
import { GlobalSettingsValuesDatatype } from 'src/common/enums/enums';

export class CreateGlobalSettingsDto {
  @IsNotEmpty()
  @IsNumber()
  global_setting_type_id: number;

  @IsString()
  @MaxLength(255)
  condition_value: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  key: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  value: string;

  @IsNotEmpty()
  @IsEnum(GlobalSettingsValuesDatatype)
  value_datatype: GlobalSettingsValuesDatatype;

  @IsNotEmpty()
  @IsNumber()
  sequence: number;

  @IsNotEmpty()
  @IsEnum(RecordStatus)
  record_status: RecordStatus;
}
