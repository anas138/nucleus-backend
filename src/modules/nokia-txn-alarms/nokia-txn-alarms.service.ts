import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { NokiaTxnAlarmsRepository } from './nokia-txn-alarms.repository';
import { FindOptionsWhere, QueryBuilder } from 'typeorm';
import { NCEAlarmModel } from 'src/models/nce-alarm.model';
import {
  APP_CONSTANTS,
  APP_MESSAGES,
  AlarmFilterPeriod,
  AlarmStatus,
  AppType,
  DATE_FORMATS,
  NCE_ALARM_CATEGORY,
} from 'src/common/enums/enums';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceAlarmSearchFilterModel } from 'src/models/nce-alarm-search-filter.model';
import { SendMailModel } from 'src/models/send-mail.model';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import {
  TransmissionTrendsFilterConditionsModel,
  TransmissionTrendsModel,
} from 'src/models/trends.model';
import { NceNetworkElement } from 'src/entities/nce-network-element.entity';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';
import { AlarmAutomatedActionsService } from '../alarm-filter-config/alarm-automated-actions.service';
import { NceGponAlarm } from 'src/entities/nce-gpon-alarm.entity';
import { NCEGponAlarmModel } from 'src/models/nce-gpon-alarms.model';
import { NceGponNetworkElement } from 'src/entities/nce-gpon-network-element.entity';
import { NokiaTxnAlarm } from 'src/entities/nokia-txn-alarm.entity';
import { NokiaTxnNetworkElement } from 'src/entities/nokia-txn-network-element.entity';

@Injectable()
export class NokiaTxnAlarmsService extends BaseService<NokiaTxnAlarm> {
  constructor(
    private alarmAutomatedActionsService: AlarmAutomatedActionsService,
    private readonly nceGponAlarmRepository: NokiaTxnAlarmsRepository,
    private helperFunctions: HelperFunctions,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly emailQueueService: EmailQueueService,
  ) {
    super(nceGponAlarmRepository);
  }
  private readonly alarmJoins = ['nokiaTxnNetworkElement'];

  async findOneByCondition(
    condition: FindOptionsWhere<NokiaTxnAlarm>,
  ): Promise<NokiaTxnAlarm> {
    return this.nceGponAlarmRepository.findByCondition(condition);
  }

  async updateAlarmChange(payload: any): Promise<NokiaTxnAlarm> {
    const condition: FindOptionsWhere<NokiaTxnAlarm> = {
      nokia_alarm_id: payload.alarm_id,
    };
    const findAlarm = await this.nceGponAlarmRepository.findByCondition(
      condition,
    );
    if (findAlarm) {
      findAlarm.nokia_txn_last_modified = new Date();
      await this.nceGponAlarmRepository.update(findAlarm);
    }
    return findAlarm;
  }
  async updateAlarmCleared(payload: any): Promise<NokiaTxnAlarm> {
    const condition: FindOptionsWhere<NokiaTxnAlarm> = {
      nokia_alarm_id: payload.alarm_id,
    };
    const findAlarm = await this.nceGponAlarmRepository.findByCondition(
      condition,
    );
    if (findAlarm) {
      findAlarm.cleared_on = payload.event_time;
      findAlarm.is_cleared = true;
      await this.nceGponAlarmRepository.update(findAlarm);
    }
    return findAlarm;
  }

  async findAllPaginated(
    nceGponAlarmSearchFilter: NceAlarmSearchFilterModel,
  ): Promise<PaginatedResultsModel> {
    const nceGponAlarmSearchColumns = ['alarm_name', 'ne_name'];
    return this.nceGponAlarmRepository.findAllWithPagination(
      nceGponAlarmSearchFilter,
      nceGponAlarmSearchColumns,
    );
  }

  public async sendNokiaTxnAlarmMail(
    sendMailModel: SendMailModel,
    alarmId: number,
  ) {
    const alarm = await this.findByCondition(
      {
        id: alarmId,
      },
      null,
      [...this.alarmJoins],
    );
    sendMailModel.html =
      await this.emailTemplatesService.getNokiaTxnAlarmEmailTemplate(alarm);
    return this.emailQueueService.addJobInQueue({ ...sendMailModel });
  }

  public async getAlarmEmailTemplate(alarmId: number) {
    const alarm = await this.findByCondition(
      {
        id: alarmId,
      },
      null,
      [...this.alarmJoins],
    );
    return this.emailTemplatesService.getNokiaTxnAlarmEmailTemplate(alarm);
  }

  async getReleventRecipeientsOfTheAlarm(
    params: AlarmRelevantUserQueryParams_DTO,
  ) {
    const alarm = await this.findById({ id: params.alarm_id });
    if (!alarm)
      throw new NotFoundException(APP_MESSAGES.NCE_ALARMS.ERROR_NOT_FOUND);
    return await this.alarmAutomatedActionsService.getRelevantUsersForEscalation(
      alarm.alarm_filter_config_id,
      alarm,
    );
  }

  async getAlarmsCount(status?: AlarmStatus, period?: AlarmFilterPeriod) {
    const defaultCondition = '1 ';
    let condition = defaultCondition;
    let statusCondition = defaultCondition;
    let periodCondition = defaultCondition;
    if (status) {
      if (status === AlarmStatus.CLEARED) {
        statusCondition = `na.is_cleared  = 1`;
      } else if (status === AlarmStatus.UN_CLEARED) {
        statusCondition = `na.is_cleared  = 0`;
      }
    }
    if (period) {
      if (period === AlarmFilterPeriod.LAST_24_HOURS) {
        periodCondition = `na.created_on  >= Now() - interval  24 hour`;
      } else if (period === AlarmFilterPeriod.LAST_WEEK) {
        periodCondition = `na.created_on  >= Now() - interval  1 week`;
      } else if (period === AlarmFilterPeriod.LAST_MONTH) {
        periodCondition = `na.created_on  >= Now() - interval  1 month`;
      }
    }
    condition = `${statusCondition} and ${periodCondition}`;

    const query = `
    select st.severity, count(na.id) as 'count'
    from nokia_txn_alarm na
    right join (select distinct severity as 'severity' from nokia_txn_alarm) st
      on st.severity = na.severity  and  ${condition}
    group by st.severity
    UNION ALL
    SELECT 'total', COUNT(na.id) AS 'alarm_count'
    FROM nokia_txn_alarm na
    WHERE ${condition}
    `;
    const rawCount = await this.nceGponAlarmRepository.executeRawQuery(query);
    return this.helperFunctions.transformDataForDashboardView(
      rawCount,
      APP_CONSTANTS.DASHBOARD_STATS_FROMAT.KEY_VALUE,
    );
  }

  getQueryBuilderWithTransmissionTrendConditions(
    transmissionTrendsFilterConditions: TransmissionTrendsFilterConditionsModel,
  ) {
    const {
      status,
      from_date: fromDate,
      to_date: toDate,
    } = transmissionTrendsFilterConditions;
    const queryBuilder = this.nceGponAlarmRepository.getSelectQueryBuilder();
    if (status === AlarmStatus.CLEARED) {
      queryBuilder.andWhere('na.is_cleared = :isCleared', { isCleared: true });
    } else if (status === AlarmStatus.UN_CLEARED) {
      queryBuilder.andWhere('na.is_cleared = :isCleared', { isCleared: false });
    }

    if (fromDate) {
      queryBuilder.andWhere('na.created_on >= :fromDate', { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere('na.created_on <= :toDate', { toDate });
    }
    return queryBuilder;
  }

  async getNokiaTxnAlarmsCountBySeverity(
    transmissionTrendsFilterConditions: TransmissionTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      transmissionTrendsFilterConditions,
    );
    // Add FROM and GROUP BY clauses
    queryBuilder
      .select('na.severity', 'label')
      .addSelect('COUNT(na.id)', 'count')
      .groupBy('na.severity')
      .orderBy('count', 'DESC');
    return queryBuilder.getRawMany();
  }

  async getTopTenAlarms(
    trendFilterConditions: TransmissionTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      trendFilterConditions,
    );

    queryBuilder
      .select(['afc.alarm_name', 'COUNT(na.id) as alarm_count'])
      .innerJoin(AlarmFilterConfig, 'afc', 'afc.id = na.alarm_filter_config_id')
      .groupBy('na.alarm_name')
      .orderBy('alarm_count', 'DESC')
      .limit(10);
    return queryBuilder.getRawMany();
  }

  async getTopTenDevicesByAlarmCount(
    trendFilterConditions: TransmissionTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      trendFilterConditions,
    );
    queryBuilder
      .select(['nne.gui_label', 'COUNT(na.id) as alarm_count'])
      .innerJoin(NokiaTxnNetworkElement, 'nne', 'nne.id = na.ne_nokia_id')
      .groupBy('nne.id')
      .orderBy('alarm_count', 'DESC')
      .limit(10);
    return queryBuilder.getRawMany();
  }

  async getDashboardWidgetTrend(
    transmissionTrendsModel: TransmissionTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      transmissionTrendsModel,
    );
    queryBuilder
      .select([
        'DATE_FORMAT(na.created_on, :dateFormat)',
        'count(na.id) alarm_count',
      ])
      .groupBy('DATE_FORMAT(na.created_on, :dateFormat)')
      .setParameter('dateFormat', DATE_FORMATS.DB_DATE);

    Object.entries(transmissionTrendsModel).forEach(
      ([key, value]) =>
        key !== 'from_date' &&
        key !== 'to_date' &&
        queryBuilder.andWhere(`na.${key} = :${key}`, { [key]: value }),
    );

    return queryBuilder.getRawMany();
  }
}
