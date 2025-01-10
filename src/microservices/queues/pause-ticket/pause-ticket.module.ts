import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { Module, forwardRef } from '@nestjs/common';
import { PauseTicketProcess } from './pause-ticket.process';
import { PauseTicketQueueService } from './pause-ticket.service';
import { TroubleTicketPauseModule } from 'src/modules/trouble-ticket-pause/trouble-ticket-pause.module';

const queue = [
  BullModule.registerQueue({
    name: QUEUES.PAUSE_TICKET,
  }),
];

@Module({
  imports: [
    ...queue,
    forwardRef(() => TroubleTicketPauseModule),
  ],
  providers: [PauseTicketQueueService, PauseTicketProcess],
  exports: [PauseTicketQueueService],
})
export class PauseTicketQueueModule {}
