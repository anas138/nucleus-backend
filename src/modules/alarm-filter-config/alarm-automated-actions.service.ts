import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { NCEAlarmModel } from 'src/models/nce-alarm.model';
import { NceNetworkElementService } from '../nce-network-element/nce-network-element.service';
import { NceNetworkElement } from 'src/entities/nce-network-element.entity';
import { UserService } from '../user/user.service';
import { IObsAlert } from 'src/models/obs-alert.model';
import { ObserviumDevice } from 'src/entities/obs-device.entity';
import { ObsDeviceService } from '../obs-device/obs-device.service';
import { User } from 'src/entities/user.entity';
import { AlarmFilterConfigService } from './alarm-filter-config.service';
import { NCEGponAlarmModel } from 'src/models/nce-gpon-alarms.model';

@Injectable()
export class AlarmAutomatedActionsService {
  constructor(
    private readonly nceNetworkElementService: NceNetworkElementService,
    private readonly obsDeviceService: ObsDeviceService,
    private readonly userService: UserService,
    private readonly alarmFilterConfigService: AlarmFilterConfigService,
  ) {}
  /**
   *
   * @decsription this returns an object of recipient for an alarm
   */
  public async getRelevantUsersForEscalation(
    alarmConfigId: number,
    alarm: NCEAlarmModel | IObsAlert | NCEGponAlarmModel | any,
  ) {
    const alarmConfig = await this.alarmFilterConfigService.getAlarmFilterById(
      alarmConfigId,
    );

    const recipients = { to: [], cc: [] as Array<string> };
    if (alarmConfig) {
      const recipientPromises = alarmConfig.alarm_recipients.map(
        async (alarm_recipient: {
          email?: string;
          recipient_type: 'To' | 'CC';
          recipient_id: number;
        }) => {
          if (alarm_recipient.email) {
            if (alarm_recipient.recipient_type === 'To') {
              recipients.to.push(alarm_recipient.email);
            } else {
              recipients.cc.push(alarm_recipient.email);
            }
          } else {
            //this code will only trigger when recipient is sub-department
            // as for all other users we will get the emails
            const { is_regional_escalation: isRegionalEscalation } =
              alarmConfig;
            let users: User[];

            /**
             * if regional escalation is turned on then email will
             * go to all users of that region having a common sub-department
             */
            if (isRegionalEscalation) {
              const alarmRegionId = await this.getAlarmRegion(alarm);
              users =
                await this.userService.getAllUsersOfSubDepartmentHavingRegion(
                  alarm_recipient.recipient_id,
                  alarmRegionId,
                );
            } else {
              /**
               * if regional escalation is turned off then email will
               * go to all users of that sub-department
               */
              users = await this.userService.getAllUsersOfSubDepartment(
                alarm_recipient.recipient_id,
              );
            }
            /**
             * first user will go in to while other will go in cc array
             * this will happen only in case if recipient_type === 'To'
             */
            if (alarm_recipient.recipient_type === 'To') {
              return (
                users.length > 0 && {
                  to: users[0].email,
                  cc: users.slice(1).map((user) => user.email),
                }
              );
            } else {
              return (
                users.length > 0 && {
                  to: '',
                  cc: users.map((user) => user.email),
                }
              );
            }
          }
        },
      );

      const resolvedRecipients = await Promise.all(recipientPromises);

      resolvedRecipients.forEach((resolvedRecipient) => {
        if (resolvedRecipient) {
          recipients.to = resolvedRecipient.to || recipients.to;
          recipients.cc.push(...resolvedRecipient.cc);
        }
      });
    }

    //if no user is in To then first user from cc list becomes the Recipint of To
    if (!recipients.to) {
      recipients.to = recipients.cc;
      recipients.cc = recipients.cc.slice(1, recipients.cc.length);
    }
    return recipients;
  }

  /**
   *
   * @decsription this returns a region id to which the alarm belogs to
   * @returns number
   */
  private async getAlarmRegion(alarm: NCEAlarmModel | IObsAlert) {
    let idField: string;
    let whereField: string;
    let service: NceNetworkElementService | ObsDeviceService;

    if ('ne_resource_id' in alarm) {
      idField = 'ne_resource_id';
      whereField = 'resource_id';
      service = this.nceNetworkElementService;
    } else if ('device_id' in alarm) {
      idField = 'device_id';
      whereField = 'device_id';
      service = this.obsDeviceService;
    } else {
      return null;
    }

    const id = alarm[idField];

    if (id) {
      const where: FindOptionsWhere<NceNetworkElement | ObserviumDevice> = {
        [whereField]: id,
      };
      const device = await service.findByCondition(where);

      if (device) {
        return device.region_id;
      }
    }

    return null;
  }
}
