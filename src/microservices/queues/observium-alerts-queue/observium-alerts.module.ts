import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUES } from 'src/common/enums/enums';
import { ObserviumAlertsQueueConsumer } from './observium-alerts.process';
import { ObserviumAlertsQueueService } from './observium-alerts-queue.service';
import { KafkaClientProducerService } from 'src/microservices/kafka/producers/kafka-client.service';
import { KafkaClientModule } from 'src/microservices/kafka/producers/kafka-client.module';
import { MngObsAlertsModule } from 'src/modules/mng-obs-alerts/mng-obs-alerts.module';

/**
 * LISTENER Level
 */

const queues = [
  BullModule.registerQueue({
    name: QUEUES.OBSERVIUM_ALERTS_QUEUE,
    defaultJobOptions: {
      removeOnComplete: QUEUES.COMPLETED_JOBS_LIMIT.OBSERVIUM_ALERTS_QUEUE,
    },
  }),
];
@Module({
  imports: [...queues, KafkaClientModule, MngObsAlertsModule],
  providers: [ObserviumAlertsQueueConsumer, ObserviumAlertsQueueService],
  exports: [...queues, ObserviumAlertsQueueService],
})
export class ObserviumAlertsQueueModule {}
