import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { MailerService } from 'src/microservices/mailer/mailer.service';
import { SendMailModel } from 'src/models/send-mail.model';
import { EmailLogsService } from 'src/modules/email-logs/email-logs.service';
import { CreateEmailLogsDto } from 'src/dto/email-logs/create-email-logs.dto';
import { EmailConfig } from 'src/config/email.config';

/**
 * Consumer for email-queue to process each job for email-sending
 */

@Processor(QUEUES.EMAIL_QUEUE)
export class EmailQueueProcess {
  constructor(
    private readonly emailService: MailerService,
    private readonly emailLogsService: EmailLogsService,
  ) {}

  @Process()
  async sendEmail(job: Job<SendMailModel>) {
    await job.progress(20);
    await this.emailService.sendMail(job.data);
    const { data } = job;
    const to = Array.isArray(data.to) ? [...data.to] : [data.to];
    const payload: CreateEmailLogsDto = {
      subject: data.subject,
      to: to.join(','),
      cc: data?.cc?.join(','),
      html_body: data.html,
      from: EmailConfig.from,
    };
    await this.emailLogsService.create(payload);

    await job.progress(100);
  }
}
