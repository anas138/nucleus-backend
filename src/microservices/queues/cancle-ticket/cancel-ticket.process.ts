import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  DROPDOWN_ITEM_IDS,
  EscalationType,
  QUEUES,
} from 'src/common/enums/enums';
import { TroubleTicketService } from 'src/modules/trouble-ticket/trouble-ticket.service';
import { AccumulatedTroubleTicketService } from 'src/modules/accumulated-trouble-ticket/accumulated-trouble-ticket.service';
import { ObsAlertsService } from 'src/modules/obs-alerts/obs-alerts.service';

/**
 * Consumer for alarm delayed actions to process each job for delayed actions of
 * email , trouble ticketing and sms
 */

@Processor(QUEUES.TICKET_REVERSAL)
export class CancelTicketProcess {
  constructor(
    private readonly troubleTicketService: TroubleTicketService,
    private readonly accumulatedTroubleTicketService: AccumulatedTroubleTicketService,
    private readonly obsAlertsService: ObsAlertsService,
  ) {}

  @Process()
  async processDelayedActions(job: Job<any>) {
    const { data } = job;
    if (data.type === 'parent') {
      await this.troubleTicketService.cancelTroubleTicket(
        data.ticket,
        null,
        null,
        null,
        null,
      );
    }

    if (data.type === 'child') {
      const obsAlert = await this.obsAlertsService.findById({
        id: data.ticket.alarm_id,
      });
      await this.troubleTicketService.update(
        { id: data.ticket.ticket_id },
        {
          message: `Alarm id:${obsAlert.id} ${obsAlert.title} is recovered.`,
          message_title: `Outage Recovered`,
        },
      );
    }
  }
}
