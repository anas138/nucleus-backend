import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { IObsAlert } from 'src/models/obs-alert.model';

/**
 * APP Level
 */

@Injectable()
export class ObserviumTransformedAlertsQueueService {
  constructor(
    @InjectQueue(QUEUES.OBSERVIUM_TRANSFORMED_ALERTS_QUEUE)
    private readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  async addJobInQueue(data: IObsAlert) {
    return this.queue.add(data);
  }
}
