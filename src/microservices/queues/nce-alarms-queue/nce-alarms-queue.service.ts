import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';

/**
 * LISTENER Level
 */

@Injectable()
export class NceAlarmsQueueService {
  constructor(
    @InjectQueue(QUEUES.NCE_ALARMS_QUEUE) private readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  addJobInQueue(data: unknown) {
    return this.queue.add(data);
  }
}
