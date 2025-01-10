import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUES } from 'src/common/enums/enums';
import { NokiaTxnTransformedAlarmsQueueService } from './nokia-txn-transformed-alarm-queue.service';
import { NceGponNetworkElementModule } from 'src/modules/nce-gpon-network-element/nce-gpon-network-element.module';
import { AlarmFilterConfigModule } from 'src/modules/alarm-filter-config/alarm-filter-config.module';
import { NceGponAlarmsModule } from 'src/modules/nce-gpon-alarms/nce-gpon-alarms.module';
import { NokiaTxnQueueController } from './nokia-txn-transformed-alarm-queue.controller';
import { NokiaTxnTransformedAlarmsQueueConsumer } from './nokia-txn-transformed-alarm-queue.process';
import { NokiaTxnNetworkElementModule } from 'src/modules/nokia-txn-network-element/nokia-txn-network-element.module';
import { NokiaTxnAlarmsModule } from 'src/modules/nokia-txn-alarms/nokia-txn-alarms.module';
/**
 * APP Level
 */

const queues = [
  BullModule.registerQueue({
    name: QUEUES.NOKIA_TXN_TRANSFORMED_ALARMS_QUEUE,
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
    NokiaTxnNetworkElementModule,
    NokiaTxnAlarmsModule,
  ],
  controllers: [NokiaTxnQueueController],
  providers: [
    NokiaTxnTransformedAlarmsQueueService,
    NokiaTxnTransformedAlarmsQueueConsumer,
  ],
  exports: [...queues, NokiaTxnTransformedAlarmsQueueService],
})
export class NokiaTxnTransformedAlarmsQueueModule {}
