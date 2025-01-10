import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { forwardRef, Module } from '@nestjs/common';
import { TroubleTicketModule } from 'src/modules/trouble-ticket/trouble-ticket.module';
import { TroubleTicketOverTATQueueService } from './trouble-ticket-overTAT.service';
import { TroubleTicketOverTATProcess } from './trouble-ticket-overTAT.process';

/**
 * APP Level
 */
const queue = [
  BullModule.registerQueue({
    name: QUEUES.TROUBLE_TICKET_OVER_TAT,
  }),
];

@Module({
  imports: [...queue, forwardRef(() => TroubleTicketModule)],
  providers: [TroubleTicketOverTATQueueService, TroubleTicketOverTATProcess],
  exports: [TroubleTicketOverTATQueueService],
})
export class TroubleTicketOverTatQueueModule {}
