import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RecordStatus } from 'src/common/enums/enums';

export class CreateGlobalSettingsTypesDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  constant: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @IsEnum(RecordStatus)
  record_status: RecordStatus;
}
