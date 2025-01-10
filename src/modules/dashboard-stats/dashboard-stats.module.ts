import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NceAlarmsModule } from '../nce-alarms/nce-alarms.module';
import { ObsAlertsModule } from '../obs-alerts/obs-alerts.module';
import { DashboardStatsService } from './dashboard-stats.service';
import { DashboardStatsController } from './dashboard-stats.controller';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceGponAlarmsModule } from '../nce-gpon-alarms/nce-gpon-alarms.module';
import { NokiaTxnAlarmsModule } from '../nokia-txn-alarms/nokia-txn-alarms.module';
import { LdiSoftSwitchAlarmModule } from '../ldi-softswitch-alarm/ldi-softswitch-alarm.module';

@Module({
  imports: [
    NceAlarmsModule,
    ObsAlertsModule,
    NceGponAlarmsModule,
    NokiaTxnAlarmsModule,
    LdiSoftSwitchAlarmModule
  ],
  providers: [DashboardStatsService, HelperFunctions],
  controllers: [DashboardStatsController],
  exports: [DashboardStatsService],
})
export class DashboardStatsModule {}
