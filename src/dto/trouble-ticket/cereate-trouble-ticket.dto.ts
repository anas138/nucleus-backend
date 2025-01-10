import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EscalationLevel, RecordStatus } from 'src/common/enums/enums';
export class CreateTroubleTicketDto {
  @IsString()
  @IsNotEmpty()
  case_title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  alarm_id: number;

  @IsNumber()
  alarm_config_id: number;

  @IsNumber()
  trouble_ticket_category_id: number;

  @IsOptional()
  @IsNumber()
  trouble_ticket_sub_category_id: number;

  @IsOptional()
  @IsNumber()
  medium: number;

  @IsOptional()
  @IsNumber()
  status: number;

  @IsOptional()
  @IsEnum(EscalationLevel)
  esclationLevel: EscalationLevel;

  @IsOptional()
  @IsNumber()
  esclation_role_id: number;

  @IsNumber()
  department_id: number;

  @IsNumber()
  sub_department_id: number;

  @IsOptional()
  @IsEnum(RecordStatus)
  record_status: RecordStatus;
}
