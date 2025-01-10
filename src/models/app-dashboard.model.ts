import { AppType, NetworkType, RecordStatus } from 'src/common/enums/enums';
import { AppDashboardWidget } from 'src/entities/app-dashboard-widgets.entity';
import { AppDashboardWidgetModel } from './app-dashboard-widget.model';

export class CreateAppDashboardModel {
  name: string;
  comment: string;
  is_shared: boolean;
  app_type: AppType;
  created_by: number;
  is_default?: boolean;
  app_dashboard_widget: AppDashboardWidgetModel[];
}

export class UpdateAppDashboardModel {
  id?: number;
  name?: string;
  comment?: string;
  is_shared?: boolean;
  app_type?: AppType;
  record_status?: RecordStatus;
  created_by?: number;
  created_at?: Date;
  updated_at?: Date;
  app_dashboard_widget?: AppDashboardWidget[];
}
