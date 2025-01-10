import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';

/**
 * LISTENER Level
 */

@Injectable()
export class ObserviumAlertsQueueService {
  constructor(
    @InjectQueue(QUEUES.OBSERVIUM_ALERTS_QUEUE) private readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  async addJobInQueue(data: unknown) {
    return this.queue.add(data);
  }
}
