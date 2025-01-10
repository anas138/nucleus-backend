import { Process, Processor } from '@nestjs/bull';
import { Inject, forwardRef } from '@nestjs/common';
import { Job } from 'bull';
import { APP_CONSTANTS, QUEUES } from 'src/common/enums/enums';
import { TroubleTicketPauseService } from 'src/modules/trouble-ticket-pause/trouble-ticket-pause.service';

/**
 * Consumer for alarm delayed actions to process each job for delayed actions of
 * email , trouble ticketing and sms
 */

@Processor(QUEUES.PAUSE_TICKET)
export class PauseTicketProcess {
  constructor(
    @Inject(forwardRef(() => TroubleTicketPauseService))
   private readonly troubleTicketPauseService: TroubleTicketPauseService,
  ) {}

  @Process()
  async processDelayedActions(job: Job<any>) {
    const { data } = job;
    const id = data.id;
    const pauseData = data.pauseData;
    return this.troubleTicketPauseService.resumePauseRequest(
      id,
      pauseData,
      APP_CONSTANTS.TYPE.AUTOMATED,
    );
  }
}
