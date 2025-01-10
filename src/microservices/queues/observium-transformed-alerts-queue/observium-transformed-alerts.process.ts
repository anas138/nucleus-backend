import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  APP_CONSTANTS,
  OBS_ALERTS_CATEGORY,
  QUEUES,
} from 'src/common/enums/enums';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { SocketGatewayService } from 'src/microservices/gateways/services/socket.gateway.service';
import { FetchAlarmFilterConfigModel } from 'src/models/alarm-filter-config.model';
import { IObsAlert } from 'src/models/obs-alert.model';
import { AlarmFilterConfigService } from 'src/modules/alarm-filter-config/alarm-filter-config.service';
import { ObsAlertsService } from 'src/modules/obs-alerts/obs-alerts.service';
import { CancelTicketQueueService } from '../cancle-ticket/cancel-ticket.service';

/**
 * APP Level
 */

@Processor(QUEUES.OBSERVIUM_TRANSFORMED_ALERTS_QUEUE)
export class ObserviumTransformedAlertsQueueConsumer {
  constructor(
    private obsAlertsService: ObsAlertsService,
    private alarmFilterConfigService: AlarmFilterConfigService,
    private readonly socketGatewayService: SocketGatewayService,
    private readonly environmentConfigService: EnvironmentConfigService,
    private readonly cancelTicketQueueService: CancelTicketQueueService,
  ) {}
  @Process()
  async saveTask(job: Job<IObsAlert>) {
    const data: IObsAlert = job.data;
    let savedAlarm: ObserviumAlert;
    const [isValidAlarm, escalate, getMatchedAlarmFilterConfigId] =
      this.alarmFilterConfigService.parseObsAlert(data);

    // Can skip apply-rules-layer or NOT
    const shouldSkipRules =
      !this.environmentConfigService.getIfApplyAlarmRules();

    // Apply Configured-Rules layer on each incoming-alarm, allow only if rule passed
    if (shouldSkipRules || (await isValidAlarm())) {
      // For insertion, apply alert_state check
      if (
        [OBS_ALERTS_CATEGORY.ALERT, OBS_ALERTS_CATEGORY.SYSLOG].includes(
          data.alert_state,
        )
      ) {
        data.alarm_filter_config_id = getMatchedAlarmFilterConfigId();

        //extract circuit id from entity_description and save in obs table
        data.nms_circuit_id = this.extractNmsCircuitId(data.entity_description);
        savedAlarm = await this.obsAlertsService.create(data);
        if (data.alarm_filter_config_id) {
          const obsAlarms = await this.obsAlertsService.findByCondition(
            {
              id: savedAlarm.id,
            },
            null,
            ['device'],
          );
          await escalate(savedAlarm.id, obsAlarms.device);
        }
      }
      // For alert_state: RECOVER update last alert of existing nature and mark it cleared
      else if (data.alert_state === OBS_ALERTS_CATEGORY.RECOVER) {
        savedAlarm = await this.obsAlertsService.updateAlarmRecovered(data);

        // Handle Ticket Reversal
        this.cancelTicketQueueService.addJobInQueue(savedAlarm);
      }
      if (savedAlarm) {
        savedAlarm.is_seen = false;

        // If alarm-occured time is within 5 mins of current-time window then broadcast realtime-events
        const current = new Date();
        const diff =
          current.getTime() - new Date(savedAlarm.alert_timestamp).getTime();
        const diffMins = Math.floor(diff / (1000 * 60));
        if (diffMins < QUEUES.RATE_LIMITER.OBS_DELAYED_ALARM_LIMIT_IN_MINS) {
          // Broadcast alarm to all connected clients
          // this.notificationsGateway.broadcastObserviumAlarm(savedAlarm);
          this.socketGatewayService.broadcastEvent({
            data: savedAlarm,
            event: APP_CONSTANTS.WEBSOCKET_EVENTS.OBS_ALARMS,
          });
          this.socketGatewayService.broadcastEvent({
            data: true,
            event: APP_CONSTANTS.WEBSOCKET_EVENTS.REFRESH_DASHBOARD_IP,
          });
        }
      }
    }
    await job.progress(100);
    return job.data;
  }

  extractNmsCircuitId(input: string) {
    const match = input.match(/\[ID:([^\]]+)\]/);
    if (match) return match[1];
    return null;
  }
}
