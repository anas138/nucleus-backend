import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { SendMailModel } from 'src/models/send-mail.model';

@Injectable()
export class SyncDevicesQueueService {
  constructor(@InjectQueue(QUEUES.SYNC_DEVICES_QUEUE) readonly queue: Queue) {
    queuePool.add(queue);
  }

  addJobInQueue() {
    return this.queue.add(1);
  }
}
