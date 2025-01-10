import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUES } from 'src/common/enums/enums';
import { NceGponTransformedAlarmsQueueService } from './nce-gpon-transformed-alarms-queue.service';
import { NceGponNetworkElementModule } from 'src/modules/nce-gpon-network-element/nce-gpon-network-element.module';
import { AlarmFilterConfigModule } from 'src/modules/alarm-filter-config/alarm-filter-config.module';
import { NceGponAlarmsModule } from 'src/modules/nce-gpon-alarms/nce-gpon-alarms.module';
import { NceGponQueueController } from './nce-gpon-transformed-alarms-queue.controller';
import { NceTransformedAlarmsQueueConsumer } from './nce-gpon-transformed-alarms-queue.process';
/**
 * APP Level
 */

const queues = [
  BullModule.registerQueue({
    name: QUEUES.NCE_GPON_TRANSFORMED_ALARMS_QUEUE,
    defaultJobOptions: {
      removeOnComplete:
        QUEUES.COMPLETED_JOBS_LIMIT.NCE_TRANSFORMED_ALARMS_QUEUE,
    },
  }),
];
@Module({
  imports: [
    ...queues,
    NceGponNetworkElementModule,
    AlarmFilterConfigModule,
    NceGponAlarmsModule,
  ],
  controllers: [NceGponQueueController],
  providers: [
    NceGponTransformedAlarmsQueueService,
    NceTransformedAlarmsQueueConsumer,
  ],
  exports: [...queues, NceGponTransformedAlarmsQueueService],
})
export class NceGponTransformedAlarmsQueueModule {}
