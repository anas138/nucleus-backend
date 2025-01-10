import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RecordStatus } from 'src/common/enums/enums';

export class UpdateAppDashboardWidgetDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  widget_type_id: number;

  @IsOptional()
  @IsBoolean()
  is_shared?: boolean;

  @IsOptional()
  app_dashboard_id?: number;

  @IsOptional()
  @IsNumber()
  alarm_config_id?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  record_status?: RecordStatus;
}
