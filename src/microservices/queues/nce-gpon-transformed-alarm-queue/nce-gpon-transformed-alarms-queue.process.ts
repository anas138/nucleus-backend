import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  APP_CONSTANTS,
  AppType,
  NCE_ALARM_CATEGORY,
  QUEUES,
} from 'src/common/enums/enums';
import { NceGponNetworkElementService } from 'src/modules/nce-gpon-network-element/nce-gpon-network-element.service';
import { AlarmFilterConfigService } from 'src/modules/alarm-filter-config/alarm-filter-config.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { NceGponAlarmsService } from 'src/modules/nce-gpon-alarms/nce-gpon-alarms.service';
import { SocketGatewayService } from 'src/microservices/gateways/services/socket.gateway.service';

@Processor(QUEUES.NCE_GPON_TRANSFORMED_ALARMS_QUEUE)
export class NceTransformedAlarmsQueueConsumer {
  constructor(
    private readonly nceGponNetworkElementService: NceGponNetworkElementService,
    private readonly alarmFilterConfigService: AlarmFilterConfigService,
    private readonly environmentConfigService: EnvironmentConfigService,
    private readonly nceGponAlarmsService: NceGponAlarmsService,
    private readonly socketGatewayService: SocketGatewayService,
  ) {}

  @Process()
  async saveAlarms(job: Job<any>) {
    const data: any = job.data;

    const getNetworkElement =
      await this.nceGponNetworkElementService.findByCondition({
        dev_sys_name: data.ne_name,
      });

    if (getNetworkElement) {
      data.ne_resource_id = getNetworkElement.resource_id;
    }

    const [isValidAlarm, escalateALarm, getMatchedAlarmFilterConfigId] =
      this.alarmFilterConfigService.parseNceAlarm(data, AppType.NCE_GPON);
    let savedAlarm: any;

    const shouldSkipRules =
      !this.environmentConfigService.getIfApplyAlarmRules();

    if (shouldSkipRules || (await isValidAlarm())) {
      if (data.category === NCE_ALARM_CATEGORY.FAULT) {
        // create alarm
        data['alarm_filter_config_id'] = getMatchedAlarmFilterConfigId();
        savedAlarm = await this.nceGponAlarmsService.create(data);
        this.broadCastAlarmChange(savedAlarm);
        if (data.alarm_filter_config_id) {
          await escalateALarm(savedAlarm.id, data.ne_resource_id);
        }
      } else if (data.category === NCE_ALARM_CATEGORY.CHANGE) {
        //update alarm
        await this.nceGponAlarmsService.updateAlarmChange(data);
      } else if (data.category === NCE_ALARM_CATEGORY.CLEAR) {
        //update alarm
        savedAlarm = await this.nceGponAlarmsService.updateAlarmCleared(data);
        this.broadCastAlarmChange(savedAlarm);
      }
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
      if (diffMins < QUEUES.RATE_LIMITER.NCE_DELAYED_ALARM_LIMIT_IN_MINS) {
        // this.notificationsGateway.broadcastNceAlarm(savedAlarm); // Broadcast alarm to all connected clients
        this.socketGatewayService.broadcastEvent({
          data: savedAlarm,
          event: APP_CONSTANTS.WEBSOCKET_EVENTS.NCE_GPON_ALARMS,
        });
        this.socketGatewayService.broadcastEvent({
          data: true,
          event: APP_CONSTANTS.WEBSOCKET_EVENTS.REFRESH_DASHBOARD_GPON,
        });
      }
    }
  }
}
