import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';

@Injectable()
export class TroubleTicketOverTATQueueService {
  constructor(
    @InjectQueue(QUEUES.TROUBLE_TICKET_OVER_TAT) readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  addJobInQueue(data: any) {
    const { troubleTicket, delay } = data;
    return this.queue.add(troubleTicket, { delay: delay });
  }
}
