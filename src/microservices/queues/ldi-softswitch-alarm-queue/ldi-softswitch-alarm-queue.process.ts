import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  APP_CONSTANTS,
  AppType,
  DROPDOWN_ITEM_IDS,
  LDI_ALERT_CATEGORY,
  LdiSoftswitchTrunkGroupStatus,
  QUEUES,
} from 'src/common/enums/enums';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { SocketGatewayService } from 'src/microservices/gateways/services/socket.gateway.service';
import { LdiSoftySwitchAlarms } from 'src/models/ldi-softswitch-alarm-queue-message.model';
import { AlarmFilterConfigService } from 'src/modules/alarm-filter-config/alarm-filter-config.service';
import { LdiSoftSwitchAlarmService } from 'src/modules/ldi-softswitch-alarm/ldi-softswitch-alarm.service';
import { LdiSoftSwitchTrunkGroupService } from 'src/modules/ldi-softswitch-trunk-group/ldi-softswitch-trunk-group.service';

@Processor(QUEUES.LDI_SOFTSWITCH_ALARM_QUEUE)
export class LdiSoftswitchTransformedAlarmsQueueConsumer {
  constructor(
    private readonly socketGatewayService: SocketGatewayService,
    private readonly ldiSoftSwitchAlarmService: LdiSoftSwitchAlarmService,
    private readonly ldiSoftSwitchTrunkGroupService: LdiSoftSwitchTrunkGroupService,
    private readonly alarmFilterConfigService: AlarmFilterConfigService,
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {}

  @Process()
  async saveAlarms(job: Job<LdiSoftySwitchAlarms>) {
    let data: LdiSoftySwitchAlarms = job.data;
    let savedAlarm: any;
    if (data.category === LDI_ALERT_CATEGORY.FAULT) {
      const ldiTrunkGroupId =
        await this.ldiSoftSwitchTrunkGroupService.findByCondition({
          trunk_name: data.trunk_group,
          status: LdiSoftswitchTrunkGroupStatus.COMMERCIAL,
        });
      // status should be commercial
      if (ldiTrunkGroupId) {
        data.ldi_softswitch_trunk_group_id = ldiTrunkGroupId.id;
        const [isValidAlarm, escalateALarm, getMatchedAlarmFilterConfigId] =
          this.alarmFilterConfigService.parseLdiSoftswitchAlarm(data);

        const shouldSkipRules =
          !this.environmentConfigService.getIfApplyAlarmRules();

        if (shouldSkipRules || (await isValidAlarm())) {
          // create alarm

          const alarmFilterConfig = getMatchedAlarmFilterConfigId();
          data.alarm_filter_config_id = alarmFilterConfig.id;
          data.created_on = new Date(data.event_time);
          data.type_txt === AppType.SIP
            ? (data.alarm_type = DROPDOWN_ITEM_IDS.ALARM_TYPE.SIP)
            : (data.alarm_type = DROPDOWN_ITEM_IDS.ALARM_TYPE.TRUNK);

          const alarm = this.checkIfSeverityChanged(alarmFilterConfig, data);

          savedAlarm = await this.ldiSoftSwitchAlarmService.create(alarm);
          if (data.alarm_filter_config_id) {
            await escalateALarm(
              savedAlarm.id,
              data.ldi_softswitch_trunk_group_id,
            );
          }
          this.broadCastAlarmChange({
            ...savedAlarm,
            alarm_filter_config: alarmFilterConfig,
          });
        }
      }
    } else if (data.category === LDI_ALERT_CATEGORY.CLEAR) {
      savedAlarm = await this.ldiSoftSwitchAlarmService.recoverAlarm(data);
      this.broadCastAlarmChange(savedAlarm);
    }
    await job.progress(100);
    return job.data;
  }

  broadCastAlarmChange(savedAlarm: any) {
    if (savedAlarm) {
      savedAlarm.is_seen = false;
      // If alarm-occured time is within 5 mins of current-time window then broadcast realtime-events
      const current = new Date();
      const diff =
        current.getTime() - new Date(savedAlarm.created_on).getTime();
      const diffMins = Math.floor(diff / (1000 * 60));
      if (diffMins < QUEUES.RATE_LIMITER.LDI_DELAYED_ALARM_LIMIT_IN_MINS) {
        // this.notificationsGateway.broadcastNceAlarm(savedAlarm); // Broadcast alarm to all connected clients
        this.socketGatewayService.broadcastEvent({
          data: savedAlarm,
          event: APP_CONSTANTS.WEBSOCKET_EVENTS.LDI_SOFTSWITCH_ALARMS,
        });
        this.socketGatewayService.broadcastEvent({
          data: true,
          event:
            APP_CONSTANTS.WEBSOCKET_EVENTS.REFRESH_DASHBOARD_LDI_SOFTSWITCH,
        });
      }
    }
  }

  checkIfSeverityChanged(alarmFilterConfig: any, alarm: any) {
    if (alarm.severity === alarmFilterConfig.conditional_severity) {
      alarm.actual_severity = alarm.severity;
      alarm.severity = alarmFilterConfig.severity_to_be_displayed;

      return alarm;
    }

    alarm.actual_severity = alarm.severity;
    return alarm;
  }
}
