import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MICROSERVICES, QUEUES } from 'src/common/enums/enums';
import { NceAlarmsQueueConsumer } from './nce-alarms.process';
import { NceAlarmsQueueService } from './nce-alarms-queue.service';
import { KafkaClientModule } from 'src/microservices/kafka/producers/kafka-client.module';
import { KafkaClientProducerService } from 'src/microservices/kafka/producers/kafka-client.service';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaConfig } from 'src/config/kafka.config';
import { NceNmsModule } from 'src/modules/nce-nms/nce-nms.module';
import { MngNceAlarmModule } from 'src/modules/mng-nce-alarm/mng-nce-alarm.module';

/**
 * LISTENER Level
 */

const queues = [
  BullModule.registerQueue({
    name: QUEUES.NCE_ALARMS_QUEUE,
    defaultJobOptions: {
      removeOnComplete: QUEUES.COMPLETED_JOBS_LIMIT.NCE_ALARMS_QUEUE,
    },
  }),
];
@Module({
  imports: [
    ...queues,
    ClientsModule.register([
      {
        name: MICROSERVICES.KAFKA,
        ...KafkaConfig,
      },
    ]),
    NceNmsModule,
    MngNceAlarmModule,
  ],
  providers: [
    NceAlarmsQueueConsumer,
    NceAlarmsQueueService,
    KafkaClientProducerService,
  ],
  exports: [...queues, NceAlarmsQueueService],
})
export class NceAlarmsQueueModule {}
