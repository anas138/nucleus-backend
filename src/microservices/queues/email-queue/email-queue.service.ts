import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { APP_CONSTANTS, QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { SendMailModel } from 'src/models/send-mail.model';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Injectable()
export class EmailQueueService {
  constructor(
    private env: EnvironmentConfigService,
    @InjectQueue(QUEUES.EMAIL_QUEUE) readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  addJobInQueue(data: SendMailModel) {
    //this.env.getIfEmailNotificationToBeSent()
    //data.sentEmail
    if (this.env.getIfEmailNotificationToBeSent() || data.subject == APP_CONSTANTS.EMAIL_SUBJECTS.RESET_PASSWORD) {
      return this.queue.add(data);
    }
  }
}
