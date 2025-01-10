import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';

@Injectable()
export class TroubleTicketEventHandlerQueueService {
  constructor(@InjectQueue(QUEUES.TROUBLE_TICKET_EVENT) readonly queue: Queue) {
    queuePool.add(queue);
  }

  addJobInQueue(data: any) {
    return this.queue.add(data);
  }
}
