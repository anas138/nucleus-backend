import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { Module } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';
import { EmailQueueProcess } from './email-queue.process';
import { MailerModule } from 'src/microservices/mailer/mailer.module';
import { MailerService } from 'src/microservices/mailer/mailer.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { EmailLogsModule } from 'src/modules/email-logs/email-logs.module';

/**
 * APP Level
 */
const queue = [
  BullModule.registerQueue({
    name: QUEUES.EMAIL_QUEUE,
  }),
];

@Module({
  imports: [...queue, MailerModule, EmailLogsModule],
  providers: [
    EmailQueueService,
    EmailQueueProcess,
    MailerService,
    EnvironmentConfigService,
  ],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
