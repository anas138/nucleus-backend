import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  APP_CONSTANTS,
  AppType,
  NCE_ALARM_CATEGORY,
  QUEUES,
} from 'src/common/enums/enums';
import { NokiaTxnNetworkElementService } from 'src/modules/nokia-txn-network-element/nokia-txn-network-element.service';
import { AlarmFilterConfigService } from 'src/modules/alarm-filter-config/alarm-filter-config.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { SocketGatewayService } from 'src/microservices/gateways/services/socket.gateway.service';
import { NokiaTxnAlarmsService } from 'src/modules/nokia-txn-alarms/nokia-txn-alarms.service';
import { NokiaTxnAlarmModel } from 'src/models/nokia-txn-alarm.model';

@Processor(QUEUES.NOKIA_TXN_TRANSFORMED_ALARMS_QUEUE)
export class NokiaTxnTransformedAlarmsQueueConsumer {
  constructor(
    private readonly nokiaTxnNetworkElementService: NokiaTxnNetworkElementService,
    private readonly alarmFilterConfigService: AlarmFilterConfigService,
    private readonly environmentConfigService: EnvironmentConfigService,
    private readonly nokiaTxnAlarmsService: NokiaTxnAlarmsService,
    private readonly socketGatewayService: SocketGatewayService,
  ) {}

  @Process()
  async saveAlarms(job: Job<NokiaTxnAlarmModel>) {
    let data: any = job.data;

    const getNetworkElement =
      await this.nokiaTxnNetworkElementService.findByCondition({
        gui_label: data.ne_name,
      });

    if (getNetworkElement) {
      data.ne_nokia_id = getNetworkElement.id;
    }

    if (data.category !== NCE_ALARM_CATEGORY.FAULT) {
      let alarm = await this.nokiaTxnAlarmsService.findByCondition({
        nokia_alarm_id: data.alarm_id,
      });

      data = { ...alarm, ...job.data };
    }

    const [isValidAlarm, escalateALarm, getMatchedAlarmFilterConfigId] =
      this.alarmFilterConfigService.parseNceAlarm(data, AppType.NOKIA_TXN);
    let savedAlarm: any;

    const shouldSkipRules =
      !this.environmentConfigService.getIfApplyAlarmRules();

    if (shouldSkipRules || (await isValidAlarm())) {
      if (data.category === NCE_ALARM_CATEGORY.FAULT) {
        // create alarm
        data['alarm_filter_config_id'] = getMatchedAlarmFilterConfigId();
        data['nokia_alarm_id'] = data.alarm_id;
        data['created_on'] = data.event_time;
        savedAlarm = await this.nokiaTxnAlarmsService.create(data);
        this.broadCastAlarmChange(savedAlarm);
        if (data.alarm_filter_config_id) {
          await escalateALarm(savedAlarm.id, data.ne_nokia_id);
        }
      } else if (data.category === NCE_ALARM_CATEGORY.CHANGE) {
        //update alarm
        await this.nokiaTxnAlarmsService.updateAlarmChange(data);
      } else if (data.category === NCE_ALARM_CATEGORY.CLEAR) {
        //update alarm
        savedAlarm = await this.nokiaTxnAlarmsService.updateAlarmCleared(data);
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
      if (diffMins < QUEUES.RATE_LIMITER.NOKIA_DELAYED_ALARM_LIMIT_IN_MINS) {
        // this.notificationsGateway.broadcastNceAlarm(savedAlarm); // Broadcast alarm to all connected clients
        this.socketGatewayService.broadcastEvent({
          data: savedAlarm,
          event: APP_CONSTANTS.WEBSOCKET_EVENTS.NOKIA_TXN_ALARMS,
        });
        this.socketGatewayService.broadcastEvent({
          data: true,
          event: APP_CONSTANTS.WEBSOCKET_EVENTS.REFRESH_DASHBOARD_NOKIA_TXN,
        });
      }
    }
  }
}
