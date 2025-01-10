import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AuditDto } from '../audit.dto';

export class AlarmFilterAdvanceConditionDto extends AuditDto {
  @IsString()
  @IsNotEmpty()
  field_name: string;

  @IsString()
  @IsNotEmpty()
  field_value: string;

  @IsString()
  @IsNotEmpty()
  search_criteria: string;
}
