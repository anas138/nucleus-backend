import { AppDashboardWidget } from 'src/entities/app-dashboard-widgets.entity';
import { AppDashboardWidgetRepository } from './app-dashboard-widget.repository';
import { BaseService } from 'src/common/services/base.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import {
  AppDashboardWidgetModel,
  CreateAppDashboardWidgetModel,
} from 'src/models/app-dashboard-widget.model';
import { APP_MESSAGES } from 'src/common/enums/enums';

@Injectable()
export class AppDashboardWidgetService extends BaseService<AppDashboardWidget> {
  constructor(
    private readonly appDashboardWidgetRepository: AppDashboardWidgetRepository,
    private readonly dataSource: DataSource,
  ) {
    super(appDashboardWidgetRepository);
  }

  async createWidgets(
    app_dashboard_widget: AppDashboardWidgetModel[],
    dashboardId: number,
    transactionManager: any,
    created_by: number,
  ): Promise<AppDashboardWidgetModel[]> {
    const queryRunner =
      transactionManager || this.dataSource.createQueryRunner();

    let savedWidgets = [];
    for (let index = 0; index < app_dashboard_widget.length; index++) {
      queryRunner.startTransaction();
      const id = app_dashboard_widget[index]?.app_dashboard_id || dashboardId;

      const checkWidget = savedWidgets.find(
        (widgets: AppDashboardWidgetModel) =>
          widgets.name === app_dashboard_widget[index].name &&
          widgets.widget_type_id === app_dashboard_widget[index].widget_type_id,
      );

      if (!checkWidget) {
        const payload = {
          ...app_dashboard_widget[index],
          app_dashboard_id: id,
          created_by: created_by,
          sequence: index,
        };

        const widget = await this.appDashboardWidgetRepository.create(
          payload,
          queryRunner.manager,
        );
        await queryRunner.commitTransaction();
        savedWidgets = [...savedWidgets, widget];
      }
      if (checkWidget) {
        throw new ConflictException(
          APP_MESSAGES.APP_DASHBOARD_WIDGET.ERROR_DUPLICATE_WIDGET,
        );
      }
    }

    return savedWidgets;
  }
}
