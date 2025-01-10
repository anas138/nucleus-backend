import { InjectRepository } from '@nestjs/typeorm';
import { AppDashboardWidget } from 'src/entities/app-dashboard-widgets.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
export class AppDashboardWidgetRepository extends BaseAbstractRepository<AppDashboardWidget> {
  constructor(
    @InjectRepository(AppDashboardWidget)
    private readonly appDashboardWidgetRepository: Repository<AppDashboardWidget>,
  ) {
    super(appDashboardWidgetRepository);
  }
}
