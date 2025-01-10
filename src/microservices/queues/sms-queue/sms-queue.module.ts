import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { Module } from '@nestjs/common';
import { SmsQueueService } from './sms-queue.service';
import { SmsProcess } from './sms-queue.process';

/**
 * APP Level
 */
const queue = [
  BullModule.registerQueue({
    name: QUEUES.SMS_QUEUE,
  }),
];

@Module({
  imports: [...queue],
  providers: [SmsQueueService, SmsProcess],
  exports: [SmsQueueService],
})
export class SmsQueueModule {}
