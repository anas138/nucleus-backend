import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { Module } from '@nestjs/common';
import { AppNotificationQueueProcess } from './app_notification-queue.process';
import { AppNotificationQueueService } from './app_notification-queue.service';
import { UserModule } from 'src/modules/user/user.module';
import { AppNotificationModule } from 'src/modules/app_notification/app_notification.module';

/**
 * APP Level
 */
const queue = [
  BullModule.registerQueue({
    name: QUEUES.APP_NOTIFICATION_QUEUE,
  }),
];

@Module({
  imports: [...queue, AppNotificationModule, UserModule],
  providers: [AppNotificationQueueService, AppNotificationQueueProcess],
  exports: [AppNotificationQueueService],
})
export class AppNotificationQueueModule {}
