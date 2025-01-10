import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { SendMailModel } from 'src/models/send-mail.model';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { SmsModel } from 'src/models/sms.model';

@Injectable()
export class SmsQueueService {
  constructor(
    private env: EnvironmentConfigService,
    @InjectQueue(QUEUES.SMS_QUEUE) readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  addJobInQueue(data: SmsModel) {
    if (this.env.getIfSmsNotificationToBeSent()) return this.queue.add(data);
  }
}
