import { Module } from '@nestjs/common';
import { AppDashboardWidgetController } from './app-dashboard-widget.controller';
import { AppDashboardWidgetRepository } from './app-dashboard-widget.repository';
import { AppDashboardWidgetService } from './app-dashboard-widget.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDashboardWidget } from 'src/entities/app-dashboard-widgets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppDashboardWidget])],
  controllers: [AppDashboardWidgetController],
  providers: [AppDashboardWidgetRepository, AppDashboardWidgetService],
  exports: [AppDashboardWidgetService, AppDashboardWidgetRepository],
})
export class AppDashboardWidgetModule {}
