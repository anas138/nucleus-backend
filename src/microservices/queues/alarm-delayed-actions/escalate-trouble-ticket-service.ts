import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { AlarmDelayedActionsModel } from 'src/models/alarm-delayed-actions.model';
import { TroubleTicketService } from 'src/modules/trouble-ticket/trouble-ticket.service';
import { UserService } from 'src/modules/user/user.service';
import {
  AppType,
  MapTroubleTicketPriorityToPermission,
} from 'src/common/enums/enums';
import { ObsAlertsService } from 'src/modules/obs-alerts/obs-alerts.service';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { NceAlarmsService } from 'src/modules/nce-alarms/nce-alarms.service';
import { TroubleTicketEventHandleService } from 'src/modules/trouble-ticket/trouble-ticket-event-handle.service';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { NceGponAlarm } from 'src/entities/nce-gpon-alarm.entity';
import { NceGponAlarmsService } from 'src/modules/nce-gpon-alarms/nce-gpon-alarms.service';
import { NokiaTxnAlarmsService } from 'src/modules/nokia-txn-alarms/nokia-txn-alarms.service';
import { NokiaTxnAlarm } from 'src/entities/nokia-txn-alarm.entity';
import { LdiSoftySwitchAlarms } from 'src/models/ldi-softswitch-alarm-queue-message.model';
import { LdiSoftSwitchAlarmService } from 'src/modules/ldi-softswitch-alarm/ldi-softswitch-alarm.service';

@Injectable()
export class EscalateTroubleTicketService {
  constructor(
    private readonly troubleTicketService: TroubleTicketService,
    private readonly userService: UserService,
    private readonly obsAlertService: ObsAlertsService,
    private readonly nceAlarmService: NceAlarmsService,
    private readonly nceGponAlarmsService: NceGponAlarmsService,
    private readonly nokiaTxnAlarmsService: NokiaTxnAlarmsService,
    private readonly troubleTicketEventHandleService: TroubleTicketEventHandleService,
    private readonly ldiSoftSwitchAlarmService: LdiSoftSwitchAlarmService,
  ) {}

  async EscalateTroubleTicket(data: Job<AlarmDelayedActionsModel>) {
    let alarm:
      | ObserviumAlert
      | NceAlarm
      | NceGponAlarm
      | NokiaTxnAlarm
      | LdiSoftySwitchAlarms;
    switch (data.data.appType) {
      case AppType.OBSERVIUM: {
        alarm = await this.obsAlertService.findById({
          id: data.data.alarmId,
        });
        break;
      }

      case AppType.NCE: {
        alarm = await this.nceAlarmService.findById({
          id: data.data.alarmId,
        });
        break;
      }

      case AppType.NCE_GPON: {
        alarm = await this.nceGponAlarmsService.findById({
          id: data.data.alarmId,
        });
        break;
      }

      case AppType.NOKIA_TXN: {
        alarm = await this.nokiaTxnAlarmsService.findById({
          id: data.data.alarmId,
        });
        break;
      }
      case AppType.LDI_SOFTSWITCH_EMS: {
        alarm = await this.ldiSoftSwitchAlarmService.findById({
          id: data.data.alarmId,
        });
        break;
      }
    }

    if (!alarm?.is_cleared) {
      const troubleTicket = await this.troubleTicketService.escalateTicket(
        data.data,
      );
      return troubleTicket;
    }
  }

  async sendEmail(troubleTicket: TroubleTicket) {
    const troubleTicketDetail =
      await this.troubleTicketService.getTroubleTicketById(troubleTicket.id);
    const todUser = await this.userService.getUserById(
      troubleTicketDetail.assigned_to_id,
    );
    const title = 'Ticket has been assigned to you and needs your response.';
    const subject = `Alarm ${troubleTicketDetail.ticket_number} | Ticket Assigned`;
    await this.troubleTicketEventHandleService.sendEmails(
      troubleTicketDetail,
      todUser,
      title,
      subject,
      MapTroubleTicketPriorityToPermission[troubleTicketDetail.priority_level],
    );
  }
}
