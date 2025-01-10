import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { BullQueuesModule } from './queues/bull-queues.module';

@Module({
  imports: [KafkaModule, BullQueuesModule],
})
export class MicroservicesModule {}
