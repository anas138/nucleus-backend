import { Injectable } from '@nestjs/common';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { UserService } from '../user/user.service';
import { TroubleTicketService } from '../trouble-ticket/trouble-ticket.service';
import { DropDownItemsService } from '../drop-down/drop-down-item.service';
import { TroubleTicketEventHandleService } from '../trouble-ticket/trouble-ticket-event-handle.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  FindOptionsWhere,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { ActivityMessage, APP_CONSTANTS } from 'src/common/enums/enums';
import { TroubleTicketEventHandlerQueueService } from 'src/microservices/queues/trouble-ticket-event-handler/trouble-ticket-event-handler.service';

@Injectable()
@EventSubscriber()
export class TroubleTicketEventSubscriber
  implements EntitySubscriberInterface<TroubleTicket>
{
  private previousStatus = '';
  constructor(
    private readonly dataSource: DataSource,
    private readonly activityLogService: ActivityLogService,
    private readonly userService: UserService,
    private readonly troubleTicketService: TroubleTicketService,
    private readonly dropDownItemsService: DropDownItemsService,
    private readonly troubleTicketEventHandleService: TroubleTicketEventHandleService,
    private readonly troubleTicketEventHandlerQueueService: TroubleTicketEventHandlerQueueService,
  ) {
    this.dataSource.subscribers.push(this);
  }
  listenTo(): string | Function {
    return TroubleTicket;
  }

  async afterInsert(event: InsertEvent<TroubleTicket>): Promise<any> {
    const payload = {
      type: APP_CONSTANTS.EVENTS.AFTER_INSERT,
      data: event.entity,
    };
    await this.troubleTicketEventHandlerQueueService.addJobInQueue(payload);
    //await this.troubleTicketEventHandleService.insertEventHandle(event);
  }

  async afterUpdate(event: UpdateEvent<TroubleTicket>): Promise<any> {
    const payload = {
      type: APP_CONSTANTS.EVENTS.AFTER_UPDATE,
      data: { entity: event.entity, databaseEntity: event.databaseEntity },
    };
    await this.troubleTicketEventHandlerQueueService.addJobInQueue(payload);
    //await this.troubleTicketEventHandleService.updateEventHandle(event);
  }
}
