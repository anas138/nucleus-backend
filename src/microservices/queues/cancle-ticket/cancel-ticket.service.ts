import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  APP_CONSTANTS,
  DROPDOWN_ITEM_IDS,
  QUEUES,
} from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { AlarmFilterConfigService } from 'src/modules/alarm-filter-config/alarm-filter-config.service';
import { TroubleTicketService } from 'src/modules/trouble-ticket/trouble-ticket.service';
import { FindOptionsWhere, Not, In } from 'typeorm';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { AccumulatedTroubleTicketService } from 'src/modules/accumulated-trouble-ticket/accumulated-trouble-ticket.service';
import { AccumulatedTroubleTicket } from 'src/entities/accumulated-trouble-ticket.entity';

@Injectable()
export class CancelTicketQueueService {
  constructor(
    private env: EnvironmentConfigService,
    @InjectQueue(QUEUES.TICKET_REVERSAL) readonly queue: Queue,
    private readonly alarmFilterConfigService: AlarmFilterConfigService,
    private readonly troubleTicketService: TroubleTicketService,
    private readonly accumulatedTroubleTicketService: AccumulatedTroubleTicketService,
  ) {
    queuePool.add(queue);
  }

  async addJobInQueue(data: ObserviumAlert | NceAlarm) {
    const child: AccumulatedTroubleTicket =
      await this.accumulatedTroubleTicketService.findByCondition(
        {
          alarm_id: data?.id,
        },
        null,
        ['troubleTicket', 'observiumAlert'],
      );
    if (child) {
      //update trouble ticket if exist
      const payload = {
        type: 'child',
        ticket: { ...child },
      };
      await this.queue.add(payload);

      const accumulatedTicket =
        await this.accumulatedTroubleTicketService.findAll({
          where: {
            ticket_id: child.ticket_id,
          },
          relations: ['observiumAlert'],
        });
      if (
        accumulatedTicket.every((alarms) => alarms.observiumAlert.is_cleared)
      ) {
        const ticket = await this.troubleTicketService.findById({
          id: child.ticket_id,
        });

        const payload = {
          type: 'parent',
          ticket: { ...ticket },
        };
        return this.queue.add(payload);
      }
    }

    if (!child) {
      const alarmId: FindOptionsWhere<TroubleTicket> = {
        alarm_id: data?.id,
        alarm_config_id: data?.alarm_filter_config_id,
        status: Not(APP_CONSTANTS.troubleTicketStatus.COMPLETED),
      };

      const ticket = await this.troubleTicketService.findByCondition(
        alarmId,
        null,
        ['outageAlarms'],
      );

      if (!ticket) {
        return 'trouble ticket is not created yet.';
      }
      const filterId: FindOptionsWhere<AlarmFilterConfig> = {
        id: ticket.alarm_config_id,
      };
      const alarmFilterConfig = await this.alarmFilterConfigService.findById(
        filterId,
      );
      if (
        alarmFilterConfig.can_revert_ticket_on_alarm_recovery &&
        ticket.ticket_generation_type ===
          APP_CONSTANTS.TROUBLE_TICKET_TYPE.AUTOMATED
      ) {
        const payload = {
          type: 'parent',
          ticket: { ...ticket },
        };
        return this.queue.add(payload);
      }
    }
  }
}
