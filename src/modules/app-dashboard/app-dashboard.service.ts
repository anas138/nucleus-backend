import { ConflictException, Injectable } from '@nestjs/common';
import { AppDashboardRepository } from './app-dashboard.repository';
import { AppDashboard } from 'src/entities/app-dashboard.entity';
import { BaseService } from 'src/common/services/base.service';
import { AppDashboardWidgetService } from '../app-dashboard-widget/app-dashboard-widget.service';
import { DataSource, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { CreateAppDashboardModel } from 'src/models/app-dashboard.model';
import { AppDashboardWidgetModel } from 'src/models/app-dashboard-widget.model';
import { AppDashboardWidget } from 'src/entities/app-dashboard-widgets.entity';
import { APP_MESSAGES } from 'src/common/enums/enums';

@Injectable()
export class AppDashboardService extends BaseService<AppDashboard> {
  constructor(
    private readonly appDashboardRepository: AppDashboardRepository,
    private readonly appDashboardWidgetService: AppDashboardWidgetService,
    private readonly dataSource: DataSource,
  ) {
    super(appDashboardRepository);
  }

  async createDashboard(
    dashboard: CreateAppDashboardModel,
  ): Promise<CreateAppDashboardModel> {
    const { app_dashboard_widget, created_by } = dashboard;

    let savedDashBoard;
    let savedWidgets = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    //create records

    try {
      savedDashBoard = await this.appDashboardRepository.create(
        dashboard,
        queryRunner.manager,
      );
      if (app_dashboard_widget.length) {
        savedWidgets = await this.appDashboardWidgetService.createWidgets(
          app_dashboard_widget,
          savedDashBoard.id,
          queryRunner,
          created_by,
        );
      }
      const data = { ...savedDashBoard, app_dashboard_widget: savedWidgets };
      await queryRunner.commitTransaction();
      return data;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createWidget(
    id: number,
    body: AppDashboardWidgetModel,
  ): Promise<AppDashboardWidgetModel> {
    const find: FindOptionsWhere<AppDashboardWidget> = {
      app_dashboard_id: id,
      name: body.name,
      widget_type_id: body.widget_type_id,
    };
    const checkWidget = await this.appDashboardWidgetService.findByCondition(
      find,
    );
    if (!checkWidget) {
      const where: FindManyOptions<AppDashboardWidget> = {
        where: { app_dashboard_id: id },
      };
      const widgetCount = await this.appDashboardWidgetService.count(where);
      const payload = { ...body, app_dashboard_id: id, sequence: widgetCount };
      return this.appDashboardWidgetService.create(payload);
    }
    throw new ConflictException(
      APP_MESSAGES.APP_DASHBOARD_WIDGET.ERROR_DUPLICATE_WIDGET,
    );
  }

  async getDashboard(id: number) {
    return this.appDashboardRepository.getDashboard(id);
  }

  async defaultDashboard(id: number): Promise<any> {
    const updatePayload = {
      is_default: false,
    };
    return this.appDashboardRepository.updateAll(updatePayload);
  }
}
