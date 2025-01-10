import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AppType, NetworkType, RecordStatus } from 'src/common/enums/enums';
import { CreateAppDashboardWidgetDto } from '../app-dashboard-widget/create-app-dashboaed-widget.dto';

export class CreateAppDashboardDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsBoolean()
  is_shared: boolean;

  @IsEnum(AppType)
  app_type: AppType;

  @IsEnum(NetworkType)
  network_type: NetworkType;

  @IsOptional()
  @IsNumber()
  created_by: number;

  @IsArray()
  app_dashboard_widget: CreateAppDashboardWidgetDto[];
}
