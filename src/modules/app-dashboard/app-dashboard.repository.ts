import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SELECT_ATTRIBUTES } from 'src/common/enums/select-attributes';
import { AppDashboard } from 'src/entities/app-dashboard.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AppDashboardRepository extends BaseAbstractRepository<AppDashboard> {
  constructor(
    @InjectRepository(AppDashboard)
    private readonly appDashboardRepository: Repository<AppDashboard>,
  ) {
    super(appDashboardRepository);
  }

  async getDashboard(id: number) {
    const query = await this.appDashboardRepository
      .createQueryBuilder('appDashboard')
      .leftJoinAndSelect(
        'appDashboard.app_dashboard_widget',
        'app_dashboard_widget',
      )
      .leftJoin('app_dashboard_widget.widgetType', 'drop_down_item')
      .leftJoin('app_dashboard_widget.alarmFilterConfig', 'alarmFilterConfig')
      .leftJoin('appDashboard.user', 'user')
      .addSelect(SELECT_ATTRIBUTES.APP_DASHBOARD_BY_ID)
      .where('appDashboard.id = :id', { id: id })
      .getOne();
    return query;
  }

  async updateAll(payload: any): Promise<any> {
    return this.appDashboardRepository.update({}, payload);
  }
}
