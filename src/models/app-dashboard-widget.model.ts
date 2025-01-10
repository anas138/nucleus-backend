import { RecordStatus, WidgetType } from 'src/common/enums/enums';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { AppDashboard } from 'src/entities/app-dashboard.entity';

export class AppDashboardWidgetModel {
  name: string;

  widget_type_id: number;

  is_shared: boolean;

  app_dashboard_id: number;

  alarmFilterConfig: AlarmFilterConfig;

  alarm_config_id: number;

  created_by?: number;

  sequence?: number;
}

export class CreateAppDashboardWidgetModel {
  app_dashboard_widget: AppDashboardWidgetModel[];
  created_by?: number;
}

export class UpdateAppDashboardWidgetModel {
  id?: number;

  name?: string;

  widget_type_id: number;

  is_shared?: boolean;

  appDashboard?: AppDashboard;

  app_dashboard_id?: number;

  alarmFilterConfig?: AlarmFilterConfig;

  alarm_config_id?: number;

  record_status?: RecordStatus;

  created_by?: number;

  created_at?: Date;

  updated_at?: Date;

  sequence?: number;
}
