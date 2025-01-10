import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { TroubleTicketHelperService } from 'src/modules/trouble-ticket/trouble-ticket-helper.service';

/**
 * Consumer for email-queue to process each job for email-sending
 */

@Processor(QUEUES.TROUBLE_TICKET_OVER_TAT)
export class TroubleTicketOverTATProcess {
  constructor(
    private readonly troubleTicketHelperService: TroubleTicketHelperService,
  ) {}

  @Process()
  async handleEvent(job: Job<any>) {
    const { data } = job;
    return this.troubleTicketHelperService.overTatTicket(
      data.id,
      data.created_by,
    );
  }
}
