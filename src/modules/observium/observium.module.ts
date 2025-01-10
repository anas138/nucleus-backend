import { Module } from '@nestjs/common';
import { ObserviumController } from './observium.controller';
import { ObserviumAlertsQueueModule } from 'src/microservices/queues/observium-alerts-queue/observium-alerts.module';
import { ObserviumService } from './observium.service';
import { KafkaClientModule } from 'src/microservices/kafka/producers/kafka-client.module';

/**
 * LISTENER Level
 */

@Module({
  controllers: [ObserviumController],
  providers: [ObserviumService],
  imports: [
    ObserviumAlertsQueueModule,
    KafkaClientModule,
  ],
})
export class ObserviumModule {}
