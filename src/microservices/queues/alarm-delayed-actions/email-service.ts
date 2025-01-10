import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { AppType } from 'src/common/enums/enums';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { NceGponAlarm } from 'src/entities/nce-gpon-alarm.entity';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { AlarmDelayedActionsModel } from 'src/models/alarm-delayed-actions.model';
import { SendMailModel } from 'src/models/send-mail.model';
import { AlarmAutomatedActionsService } from 'src/modules/alarm-filter-config/alarm-automated-actions.service';
import { NceAlarmsService } from 'src/modules/nce-alarms/nce-alarms.service';
import { ObsAlertsService } from 'src/modules/obs-alerts/obs-alerts.service';
import { NceGponAlarmsService } from 'src/modules/nce-gpon-alarms/nce-gpon-alarms.service';
import { LdiSoftSwitchAlarmService } from 'src/modules/ldi-softswitch-alarm/ldi-softswitch-alarm.service';
import { NokiaTxnAlarmsService } from 'src/modules/nokia-txn-alarms/nokia-txn-alarms.service';
@Injectable()
export class EmailService {
  constructor(
    private obsAlertService: ObsAlertsService,
    private nceAlarmService: NceAlarmsService,
    private nceGponAlarmsService: NceGponAlarmsService,
    private alarmAutomatedActionsService: AlarmAutomatedActionsService,
    private ldiSoftSwitchAlarmService: LdiSoftSwitchAlarmService,
    private nokiaTxnAlarmsService: NokiaTxnAlarmsService,
  ) {}

  async escalateEmail(job: Job<AlarmDelayedActionsModel>) {
    let alarm: any;
    let emailSendingFunction: Function;
    let alertId: number;
    let subject: string;

    switch (job.data.appType) {
      case AppType.OBSERVIUM: {
        alarm = await this.obsAlertService.findById({
          id: job.data.alarmId,
        });
        emailSendingFunction = (
          sendMailModel: SendMailModel,
          alertId: number,
        ) => {
          this.obsAlertService.sendObserviumAlertMail(sendMailModel, alertId);
        };
        alertId = alarm?.id;
        subject = `Alert: [${alarm?.device_hostname}] - ${
          alarm?.alert_message
        } ${alarm?.entity_name ? `{${alarm?.entity_name}}` : ''} (${
          alarm.alert_severity
        })`;
        break;
      }

      case AppType.NCE: {
        alarm = await this.nceAlarmService.findById({
          id: job.data.alarmId,
        });
        emailSendingFunction = (
          sendMailModel: SendMailModel,
          alertId: number,
        ) => {
          this.nceAlarmService.sendNceAlarmMail(sendMailModel, alertId);
        };

        alertId = alarm?.id;

        subject = `Alert: ${alarm.ne_name} - ${alarm?.alarm_name} (${alarm.severity})`;
        break;
      }
      case AppType.NCE_GPON: {
        alarm = await this.nokiaTxnAlarmsService.findById({
          id: job.data.alarmId,
        });
        emailSendingFunction = (
          sendMailModel: SendMailModel,
          alertId: number,
        ) => {
          this.nceAlarmService.sendNceAlarmMail(sendMailModel, alertId);
        };

        alertId = alarm?.id;

        subject = `Network Alert: ${alarm?.trunk_group} - ${alarm?.message_state} (${alarm.severity})`;
        break;
      }

      case AppType.NOKIA_TXN: {
        alarm = await this.nceGponAlarmsService.findById({
          id: job.data.alarmId,
        });
        emailSendingFunction = (
          sendMailModel: SendMailModel,
          alertId: number,
        ) => {
          this.nceAlarmService.sendNceAlarmMail(sendMailModel, alertId);
        };

        alertId = alarm?.id;

        subject = `Network Alert: ${alarm?.trunk_group} - ${alarm?.message_state} (${alarm.severity})`;
        break;
      }

      case AppType.LDI_SOFTSWITCH_EMS: {
        alarm = await this.ldiSoftSwitchAlarmService.findById({
          id: job.data.alarmId,
        });
        emailSendingFunction = (
          sendMailModel: SendMailModel,
          alertId: number,
        ) => {
          this.nceAlarmService.sendNceAlarmMail(sendMailModel, alertId);
        };

        alertId = alarm?.id;

        subject = `Alert: [${alarm?.ne_name}] - ${alarm?.native_probable_cause}`;
        break;
      }
    }

    let mailData: SendMailModel;
    if (!alarm?.is_cleared) {
      const recipients =
        await this.alarmAutomatedActionsService.getRelevantUsersForEscalation(
          job.data.alarmConfigId,
          alarm,
        );
      mailData = {
        to: recipients.to,
        cc: recipients.cc,
        subject,
      };
      emailSendingFunction(mailData, alertId);
    }
    job.progress(100);
    return mailData;
  }
}
