import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { SendMailModel } from 'src/models/send-mail.model';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { NotificationModel } from 'src/models/notification.model';

@Injectable()
export class AppNotificationQueueService {
  constructor(
    private env: EnvironmentConfigService,
    @InjectQueue(QUEUES.APP_NOTIFICATION_QUEUE) readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  addJobInQueue(data: NotificationModel) {
    return this.queue.add(data);
  }
}
