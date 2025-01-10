import { Module } from '@nestjs/common';
import { AppDashboardController } from './app-dashboard.controller';
import { AppDashboardRepository } from './app-dashboard.repository';
import { AppDashboardService } from './app-dashboard.service';
import { AppDashboardWidgetModule } from '../app-dashboard-widget/app-dashboard-widget.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDashboard } from 'src/entities/app-dashboard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppDashboard]), AppDashboardWidgetModule],
  controllers: [AppDashboardController],
  providers: [AppDashboardRepository, AppDashboardService],
  exports: [AppDashboardRepository, AppDashboardService],
})
export class AppDashboardModule {}
