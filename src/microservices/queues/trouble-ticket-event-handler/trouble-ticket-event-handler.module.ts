import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { Module } from '@nestjs/common';
import { TroubleTicketEventHandlerProcess } from './trouble-ticket-event-handler.pocess';
import { TroubleTicketEventHandlerQueueService } from './trouble-ticket-event-handler.service';
import { TroubleTicketModule } from 'src/modules/trouble-ticket/trouble-ticket.module';
import { UserModule } from 'src/modules/user/user.module';
/**
 * APP Level
 */
const queue = [
  BullModule.registerQueue({
    name: QUEUES.TROUBLE_TICKET_EVENT,
  }),
];

@Module({
  imports: [...queue, TroubleTicketModule, UserModule],
  providers: [
    TroubleTicketEventHandlerQueueService,
    TroubleTicketEventHandlerProcess,
  ],
  exports: [TroubleTicketEventHandlerQueueService],
})
export class TroubleTicketEventHandlerQueueModule {}
