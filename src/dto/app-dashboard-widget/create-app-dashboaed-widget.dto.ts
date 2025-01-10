import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RecordStatus, WidgetType } from 'src/common/enums/enums';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { DropDownItem } from 'src/entities/drop-down-item.entity';

export class CreateAppDashboardWidgetDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsEnum(DropDownItem)
  widgetType: DropDownItem;

  @IsNumber()
  widget_type_id: number;

  @IsBoolean()
  is_shared: boolean;

  @IsOptional()
  @IsNumber()
  app_dashboard_id: number;

  @IsOptional()
  @IsEnum(AlarmFilterConfig)
  alarmFilterConfig: AlarmFilterConfig;

  @IsNumber()
  alarm_config_id: number;

  @IsOptional()
  @IsNumber()
  created_by: number;

  @IsOptional()
  @IsNumber()
  sequence: number;
}

export class ModifiedCreateDashboardWidgetDto {
  app_dashboard_widget: CreateAppDashboardWidgetDto[];
}
