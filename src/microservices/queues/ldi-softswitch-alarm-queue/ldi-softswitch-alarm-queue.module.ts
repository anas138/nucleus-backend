import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUES } from 'src/common/enums/enums';
import { LdiSoftswitchTransformedAlarmsQueueService } from './ldi-softswitch-alarm-queue.service';
import { AlarmFilterConfigModule } from 'src/modules/alarm-filter-config/alarm-filter-config.module';
import { NokiaTxnQueueController } from './ldi-softswitch-alarm-queue.controller';
import { LdiSoftswitchTransformedAlarmsQueueConsumer } from './ldi-softswitch-alarm-queue.process';
import { LdiSoftSwitchAlarmModule } from 'src/modules/ldi-softswitch-alarm/ldi-softswitch-alarm.module';
import { LdiSoftSwitchTrunkGroupModule } from 'src/modules/ldi-softswitch-trunk-group/ldi-softswitch-trunk-group.module';
import { EnvironmentConfigModule } from 'src/config/environment-config/environment-config.module';

/**
 * APP Level
 */
const queues = [
  BullModule.registerQueue({
    name: QUEUES.LDI_SOFTSWITCH_ALARM_QUEUE,
    defaultJobOptions: {
      removeOnComplete:
        QUEUES.COMPLETED_JOBS_LIMIT.NCE_TRANSFORMED_ALARMS_QUEUE,
    },
  }),
];
@Module({
  imports: [
    ...queues,
    AlarmFilterConfigModule,
    LdiSoftSwitchAlarmModule,
    LdiSoftSwitchTrunkGroupModule,
    EnvironmentConfigModule,
  ],
  controllers: [NokiaTxnQueueController],
  providers: [
    LdiSoftswitchTransformedAlarmsQueueService,
    LdiSoftswitchTransformedAlarmsQueueConsumer,
  ],
  exports: [...queues, LdiSoftswitchTransformedAlarmsQueueService],
})
export class LdiSoftswitchAlarmQueueModule {}
