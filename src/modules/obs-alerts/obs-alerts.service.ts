import { Injectable, NotFoundException } from '@nestjs/common';
import { ObsAlertsRepository } from './obs-alerts.repository';
import { BaseService } from 'src/common/services/base.service';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { IObsAlert } from 'src/models/obs-alert.model';
import { FindOptionsWhere, QueryBuilder } from 'typeorm';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { ObsAlertSearchFilterModel } from 'src/models/obs-alert-search-filter.model';
import { SendMailModel } from 'src/models/send-mail.model';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import {
  APP_CONSTANTS,
  APP_MESSAGES,
  AlarmFilterPeriod,
  AlarmStatus,
  AppType,
  DATE_FORMATS,
} from 'src/common/enums/enums';
import {
  IpTrendsFilterConditionsModel,
  TransmissionTrendsFilterConditionsModel,
} from 'src/models/trends.model';
import { ObserviumDevice } from 'src/entities/obs-device.entity';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';
import { AlarmAutomatedActionsService } from '../alarm-filter-config/alarm-automated-actions.service';

@Injectable()
export class ObsAlertsService extends BaseService<ObserviumAlert> {
  constructor(
    private readonly alarmAutomatedActionsService: AlarmAutomatedActionsService,
    private repo: ObsAlertsRepository,
    private helperFunctions: HelperFunctions,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly emailQueueService: EmailQueueService,
  ) {
    super(repo);
  }
  private readonly alarmJoins = ['device', 'device.region'];

  async updateAlarmRecovered(payload: IObsAlert) {
    let condition: FindOptionsWhere<ObserviumAlert> = {
      alert_id: payload.alert_id,
      is_cleared: false,
    };
    const alert = await this.repo.findByCondition(condition, {
      alert_timestamp: 'DESC',
    });
    if (alert) {
      alert.cleared_on = payload.alert_timestamp;
      alert.is_cleared = true;
      await this.repo.update(alert);
    }
    return alert;
  }

  async findAllWithPagination(
    obsAlertSearchFilterModel: ObsAlertSearchFilterModel,
  ): Promise<PaginatedResultsModel> {
    const obsAlertSearchColumns = ['alert_message', 'device_hostname'];
    return this.repo.findAllWithPagination(
      obsAlertSearchFilterModel,
      obsAlertSearchColumns,
    );
  }

  public async sendObserviumAlertMail(
    sendMailModel: SendMailModel,
    alertId: number,
  ) {
    const alert: ObserviumAlert = await this.findByCondition(
      {
        id: alertId,
      },
      null,
      [...this.alarmJoins],
    );
    sendMailModel.html =
      await this.emailTemplatesService.getObsAlarmEmailTempalte(alert);
    return this.emailQueueService.addJobInQueue({ ...sendMailModel });
  }
  public async getAlarmEmailTemplate(alertId: number) {
    const alert: ObserviumAlert = await this.findByCondition(
      {
        id: alertId,
      },
      null,
      [...this.alarmJoins],
    );
    return this.emailTemplatesService.getObsAlarmEmailTempalte(alert);
  }

  async getObsAlertsCountBySeverity(
    trendFilterConditions: IpTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      trendFilterConditions,
    );
    queryBuilder
      .select(['oa.alert_severity as label', 'COUNT(oa.id) as count'])
      .groupBy('oa.alert_severity')
      .orderBy('count', 'DESC');

    return queryBuilder.getRawMany();
  }

  async getTopTenDevicesByAlertCount(
    trendFilterConditions: IpTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      trendFilterConditions,
    );
    queryBuilder
      .select(['od.hostname', 'COUNT(oa.id) as alert_count'])
      .innerJoin(ObserviumDevice, 'od', 'od.device_id = oa.device_id')
      .groupBy('od.device_id')
      .orderBy('alert_count', 'DESC')
      .limit(10);
    return queryBuilder.getRawMany();
  }

  async getTopTenAlerts(trendFilterConditions: IpTrendsFilterConditionsModel) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      trendFilterConditions,
    );
    queryBuilder
      .select(['afc.alarm_name', 'COUNT(oa.id) as alarm_count'])
      .innerJoin(AlarmFilterConfig, 'afc', 'afc.id = oa.alarm_filter_config_id')
      .groupBy('oa.alarm_filter_config_id')
      .orderBy('alarm_count')
      .limit(10);
    return queryBuilder.getRawMany();
  }

  async getAlertsCount(status?: AlarmStatus, period?: AlarmFilterPeriod) {
    const defaultCondition = '1 ';
    let condition = defaultCondition;
    let statusCondition = defaultCondition;
    let periodCondition = defaultCondition;
    if (status) {
      if (status === AlarmStatus.CLEARED) {
        statusCondition = `oa.is_cleared  = 1`;
      } else if (status === AlarmStatus.UN_CLEARED) {
        statusCondition = `oa.is_cleared  = 0`;
      }
    }
    if (period) {
      if (period === AlarmFilterPeriod.LAST_24_HOURS) {
        periodCondition = `oa.created_at  >= Now() - interval  24 hour`;
      } else if (period === AlarmFilterPeriod.LAST_WEEK) {
        periodCondition = `oa.created_at  >= Now() - interval  1 week`;
      } else if (period === AlarmFilterPeriod.LAST_MONTH) {
        periodCondition = `oa.created_at  >= Now() - interval  1 month`;
      }
    }
    condition = `${statusCondition} and ${periodCondition}`;

    const query = `
    select st.severity, count(oa.id) as 'count'
    from observium_alert oa 
    right join (select distinct alert_severity as 'severity' from observium_alert) st 
      on st.severity = oa.alert_severity  and  ${condition}
    group by st.severity  
    UNION ALL
    SELECT 'total', COUNT(oa.id) AS 'alert_count'
    FROM observium_alert oa
    WHERE ${condition} 
    `;
    const rawCount = await this.repo.executeRawQuery(query);
    return this.helperFunctions.transformDataForDashboardView(
      rawCount,
      APP_CONSTANTS.DASHBOARD_STATS_FROMAT.KEY_VALUE,
    );
  }

  getQueryBuilderWithTransmissionTrendConditions(
    IpTrendsFilterConditions: IpTrendsFilterConditionsModel,
  ) {
    const {
      status,
      from_date: fromDate,
      to_date: toDate,
    } = IpTrendsFilterConditions;
    const queryBuilder = this.repo.getSelectQueryBuilder();
    if (status === AlarmStatus.CLEARED) {
      queryBuilder.andWhere('oa.is_cleared = :isCleared', { isCleared: true });
    } else if (status === AlarmStatus.UN_CLEARED) {
      queryBuilder.andWhere('oa.is_cleared = :isCleared', { isCleared: false });
    }

    if (fromDate) {
      queryBuilder.andWhere('oa.alert_timestamp >= :fromDate', { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere('oa.alert_timestamp <= :toDate', { toDate });
    }
    return queryBuilder;
  }

  async getReleventRecipeientsOfTheAlarm(
    params: AlarmRelevantUserQueryParams_DTO,
  ) {
    const alarm = await this.findById({ id: params.alarm_id });
    if (!alarm)
      throw new NotFoundException(APP_MESSAGES.OBS_ALERTS.ERROR_NOT_FOUND);
    return await this.alarmAutomatedActionsService.getRelevantUsersForEscalation(
      alarm.alarm_filter_config_id,
      alarm,
    );
  }

  async getDashboardWidgetTrend(
    IpTrendsFilterConditions: IpTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      IpTrendsFilterConditions,
    );
    queryBuilder
      .select([
        'DATE_FORMAT(oa.alert_timestamp, :dateFormat)',
        'count(oa.entity_name) alarm_count',
      ])
      .leftJoin(AlarmFilterConfig, 'afc', 'afc.id = oa.alarm_filter_config_id')
      .groupBy('DATE_FORMAT(oa.alert_timestamp, :dateFormat)')
      .setParameter('dateFormat', DATE_FORMATS.DB_DATE);

    Object.entries(IpTrendsFilterConditions).forEach(
      ([key, value]) =>
        key !== 'to_date' &&
        key !== 'from_date' &&
        queryBuilder.andWhere(`oa.${key} = :${key}`, { [key]: value }),
    );

    return queryBuilder.getRawMany();
  }
}
