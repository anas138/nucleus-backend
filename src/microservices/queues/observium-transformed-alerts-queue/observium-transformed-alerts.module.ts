import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUES } from 'src/common/enums/enums';
import { ObserviumTransformedAlertsQueueConsumer } from './observium-transformed-alerts.process';
import { ObserviumTransformedAlertsQueueService } from './observium-transformed-alerts-queue.service';
import { ObsAlertsModule } from 'src/modules/obs-alerts/obs-alerts.module';
import { AlarmFilterConfigModule } from 'src/modules/alarm-filter-config/alarm-filter-config.module';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { CancelTicketQueueModule } from '../cancle-ticket/cancel-ticket.module';
import { ObserviumTransformedController } from './observium-transformed-alaert-controller';

/**
 * APP Level
 */

const queues = [
  BullModule.registerQueue({
    name: QUEUES.OBSERVIUM_TRANSFORMED_ALERTS_QUEUE,
    // limiter: QUEUES.RATE_LIMITER.OBSERVIUM_TRANSFORMED_ALERTS_QUEUE,
    defaultJobOptions: {
      removeOnComplete:
        QUEUES.COMPLETED_JOBS_LIMIT.OBSERVIUM_TRANSFORMED_ALERTS_QUEUE,
    },
  }),
];
@Module({
  imports: [
    ...queues,
    ObsAlertsModule,
    AlarmFilterConfigModule,
    CancelTicketQueueModule,
    // NotificationsGateway,
  ],
  controllers: [ObserviumTransformedController],
  providers: [
    ObserviumTransformedAlertsQueueConsumer,
    ObserviumTransformedAlertsQueueService,
    // NotificationsGateway,
    EnvironmentConfigService,
  ],
  exports: [...queues, ObserviumTransformedAlertsQueueService],
})
export class ObserviumTransformedAlertsQueueModule {}
