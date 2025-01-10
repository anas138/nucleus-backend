import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { Module } from '@nestjs/common';
import { CancelTicketProcess } from './cancel-ticket.process';
import { CancelTicketQueueService } from './cancel-ticket.service';
import { AlarmFilterConfigModule } from 'src/modules/alarm-filter-config/alarm-filter-config.module';
import { TroubleTicketModule } from 'src/modules/trouble-ticket/trouble-ticket.module';
import { AccumulatedTroubleTicketModule } from 'src/modules/accumulated-trouble-ticket/accumulated-trouble-ticket.module';
import { CancelQueueTroubleTicket } from './cancel-ticket.controller';
import { ObsAlertsModule } from 'src/modules/obs-alerts/obs-alerts.module';

/**
 * APP Level
 */
const queue = [
  BullModule.registerQueue({
    name: QUEUES.TICKET_REVERSAL,
  }),
];

@Module({
  imports: [
    ...queue,
    AlarmFilterConfigModule,
    TroubleTicketModule,
    AccumulatedTroubleTicketModule,
    ObsAlertsModule,
  ],

  controllers: [CancelQueueTroubleTicket],
  providers: [CancelTicketQueueService, CancelTicketProcess],
  exports: [CancelTicketQueueService],
})
export class CancelTicketQueueModule {}
