import { Module } from '@nestjs/common';
import { TroubleTicketEventSubscriber } from './trouble-ticket-event-subscriber.service';
import { ActivityLogModule } from '../activity-log/activity.log.module';
import { UserModule } from '../user/user.module';
import { TroubleTicketModule } from '../trouble-ticket/trouble-ticket.module';
import { DropDownModule } from '../drop-down/drop-down.module';
import { TroubleTicketEventHandlerQueueModule } from 'src/microservices/queues/trouble-ticket-event-handler/trouble-ticket-event-handler.module';

@Module({
  imports: [
    ActivityLogModule,
    UserModule,
    TroubleTicketModule,
    DropDownModule,
    TroubleTicketEventHandlerQueueModule,
  ],
  providers: [TroubleTicketEventSubscriber],
})
export class EventSubscriberModule {}
