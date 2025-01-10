import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUES } from 'src/common/enums/enums';
import { NceTransformedAlarmsQueueConsumer } from './nce-transformed-alarms.process';
import { NceTransformedAlarmsQueueService } from './nce-transformed-alarms-queue.service';
import { NceAlarmsModule } from 'src/modules/nce-alarms/nce-alarms.module';
import { AlarmFilterConfigModule } from 'src/modules/alarm-filter-config/alarm-filter-config.module';
import { AlarmFilterAdvanceConditionModule } from 'src/modules/alarm-filter-advance-condition/alarm-filter-advance-condition.module';
import { NceNetworkElementModule } from 'src/modules/nce-network-element/nce-network-element.module';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { CancelTicketQueueModule } from '../cancle-ticket/cancel-ticket.module';

/**
 * APP Level
 */

const queues = [
  BullModule.registerQueue({
    name: QUEUES.NCE_TRANSFORMED_ALARMS_QUEUE,
    defaultJobOptions: {
      removeOnComplete:
        QUEUES.COMPLETED_JOBS_LIMIT.NCE_TRANSFORMED_ALARMS_QUEUE,
    },
  }),
];
@Module({
  imports: [
    ...queues,
    NceAlarmsModule,
    NceNetworkElementModule,
    AlarmFilterConfigModule,
    AlarmFilterAdvanceConditionModule,
    CancelTicketQueueModule,
    // NotificationsGateway,
  ],
  providers: [
    NceTransformedAlarmsQueueConsumer,
    NceTransformedAlarmsQueueService,
    // NotificationsGateway,
    EnvironmentConfigService,
  ],
  exports: [...queues, NceTransformedAlarmsQueueService],
})
export class NceTransformedAlarmsQueueModule {}
