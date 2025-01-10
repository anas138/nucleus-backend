import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EscalationType, QUEUES } from 'src/common/enums/enums';
import { AlarmDelayedActionsModel } from 'src/models/alarm-delayed-actions.model';
import { EmailService } from './email-service';
import { EscalateTroubleTicketService } from './escalate-trouble-ticket-service';
/**
 * Consumer for alarm delayed actions to process each job for delayed actions of
 * email , trouble ticketing and sms
 */

@Processor(QUEUES.ALARMS_DELAYED_ACTIONS_QUEUE)
export class AlarmDelayedActionsProcess {
  constructor(
    private emailService: EmailService,
    private escalateTroubleTicketService: EscalateTroubleTicketService,
  ) {}

  @Process()
  async processDelayedActions(job: Job<AlarmDelayedActionsModel>) {
    if (job.data.escalationType === EscalationType.EMAIL) {
      await this.emailService.escalateEmail(job);
    } else if (job.data.escalationType === EscalationType.TROUBLE_TICKET) {
      await this.escalateTroubleTicketService.EscalateTroubleTicket(job);
      console.log('escalating tt');
    } else if (job.data.escalationType === EscalationType.SMS) {
      console.log('escalating sms');
    }
  }
}
