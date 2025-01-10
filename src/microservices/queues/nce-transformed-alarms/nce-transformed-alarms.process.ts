import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  APP_CONSTANTS,
  AppType,
  NCE_ALARM_CATEGORY,
  QUEUES,
} from 'src/common/enums/enums';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { AlarmFilterAdvanceCondition } from 'src/entities/alarm-filter-advance-condition.entity';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { SocketGatewayService } from 'src/microservices/gateways/services/socket.gateway.service';
import { NCEAlarmModel } from 'src/models/nce-alarm.model';
import { AlarmFilterConfigService } from 'src/modules/alarm-filter-config/alarm-filter-config.service';
import { NceAlarmsService } from 'src/modules/nce-alarms/nce-alarms.service';
import { NceNetworkElementService } from 'src/modules/nce-network-element/nce-network-element.service';
import { FindOptionsWhere } from 'typeorm';
import { CancelTicketQueueService } from '../cancle-ticket/cancel-ticket.service';

/**
 * APP Level
 */

/**
 * Save Transformed Alarm Data
 */
@Processor(QUEUES.NCE_TRANSFORMED_ALARMS_QUEUE)
export class NceTransformedAlarmsQueueConsumer {
  constructor(
    private nceAlarmService: NceAlarmsService,
    private alarmFilterConfigService: AlarmFilterConfigService,
    private readonly socketGatewayService: SocketGatewayService,
    private readonly nceNeService: NceNetworkElementService,
    private readonly environmentConfigService: EnvironmentConfigService,
    private readonly cancelTicketQueueService: CancelTicketQueueService,
  ) {}

  @Process()
  async saveAlarm(job: Job<NCEAlarmModel>) {
    const data = job.data;
    // Fetch ne-resource-id by ne_name if its null in alarm-paylaod
    // if (!data.ne_resource_id) {
    //   const networkElement = await this.nceNeService.getNEByName(data.ne_name);
    //   data.ne_resource_id = networkElement ? networkElement.resource_id : null;
    // }

    // Fetch ne-device from db against ne_name and check its admin_status 
    // Skip 'inactive' devices |  column 'admin_status' was already available
    const networkElement = await this.nceNeService.getNEByName(data.ne_name);
    if (networkElement && networkElement.admin_status == 'active') {
      data.ne_resource_id = networkElement ? networkElement.resource_id : null;
    }

    // Validate & escalate as per ALarm-Fiter Configurations
    const [isValidAlarm, escalateALarm, getMatchedAlarmFilterConfigId] =
      this.alarmFilterConfigService.parseNceAlarm(data, AppType.NCE);
    let savedAlarm: NceAlarm;

    const shouldSkipRules =
      !this.environmentConfigService.getIfApplyAlarmRules();

    if (shouldSkipRules || (await isValidAlarm())) {
      if (data.category === NCE_ALARM_CATEGORY.FAULT) {
        data.alarm_filter_config_id = getMatchedAlarmFilterConfigId();
        savedAlarm = await this.nceAlarmService.create(data);
        if (data.alarm_filter_config_id) {
          await escalateALarm(savedAlarm.id, data.ne_resource_id);
        }
        this.broadCastAlarmChange(savedAlarm);
      } else if (data.category === NCE_ALARM_CATEGORY.CHANGE) {
        savedAlarm = await this.nceAlarmService.updateAlarmChange(data);
      } else if (data.category === NCE_ALARM_CATEGORY.CLEAR) {
        // mark any existing alarm cleared
        savedAlarm = await this.nceAlarmService.updateAlarmCleared(data);
        this.broadCastAlarmChange(savedAlarm);

        // Handle Cancel Trouble Ticket
        this.cancelTicketQueueService.addJobInQueue(savedAlarm);
      }
    }
    await job.progress(100);
    return job.data;
  }

  /**
   *
   * @param savedAlarm
   * @description Apply time occurance delay check before broadcasting this alarm/cleared-change
   */
  broadCastAlarmChange(savedAlarm: NceAlarm) {
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
          event: APP_CONSTANTS.WEBSOCKET_EVENTS.NCE_ALARMS,
        });
        this.socketGatewayService.broadcastEvent({
          data: true,
          event: APP_CONSTANTS.WEBSOCKET_EVENTS.REFRESH_DASHBOARD_TRANSMISSION,
        });
      }
    }
  }
}
