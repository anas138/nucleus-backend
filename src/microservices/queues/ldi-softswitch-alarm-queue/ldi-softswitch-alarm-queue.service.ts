import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';

/**
 * APP Level
 */

@Injectable()
export class LdiSoftswitchTransformedAlarmsQueueService {
  constructor(
    @InjectQueue(QUEUES.LDI_SOFTSWITCH_ALARM_QUEUE)
    private readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  addJobInQueue(data: unknown) {
    return this.queue.add(data);
  }
}