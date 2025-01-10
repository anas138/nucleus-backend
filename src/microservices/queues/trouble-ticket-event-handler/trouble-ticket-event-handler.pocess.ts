import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { APP_CONSTANTS, QUEUES } from 'src/common/enums/enums';
import { TroubleTicketEventHandleService } from 'src/modules/trouble-ticket/trouble-ticket-event-handle.service';
import { UserService } from 'src/modules/user/user.service';
import { TroubleTicketService } from 'src/modules/trouble-ticket/trouble-ticket.service';

/**
 * Consumer for email-queue to process each job for email-sending
 */

@Processor(QUEUES.TROUBLE_TICKET_EVENT)
export class TroubleTicketEventHandlerProcess {
  constructor(
    private readonly troubleTicketEventHandleService: TroubleTicketEventHandleService,
    private readonly userService: UserService,
    private readonly troubleTicketService: TroubleTicketService,
  ) {}

  @Process()
  async handleEvent(job: Job<any>) {
    const { data } = job;
    if (data.type === APP_CONSTANTS.EVENTS.AFTER_INSERT) {
      const troubleTicket =
        await this.troubleTicketEventHandleService.insertEventHandle(data.data);
      return troubleTicket;
    }

    if ((data.type = APP_CONSTANTS.EVENTS.AFTER_UPDATE)) {
      return this.troubleTicketEventHandleService.updateEventHandle(
        data.data.entity,
        data.data.databaseEntity,
      );
    }
  }
}
