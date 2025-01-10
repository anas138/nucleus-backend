import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AppType, RecordStatus } from 'src/common/enums/enums';
import { AppDashboardWidget } from 'src/entities/app-dashboard-widgets.entity';

export class UpdateAppDashboardDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_shared: boolean;

  @IsOptional()
  @IsEnum(RecordStatus)
  record_status: RecordStatus;

  @IsOptional()
  @IsBoolean()
  is_default: boolean;
}
