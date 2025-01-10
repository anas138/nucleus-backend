import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { LdiSoftSwitchAlarmRepository } from './ldi-softswitch-alarm.repository';
import { LdiSoftswitchEmsAlarm } from 'src/entities/ldi-softswitch-alarm.entity';
import {
  LdiSoftswitchAlarmsFilterModel,
  LdiSoftySwitchAlarms,
} from 'src/models/ldi-softswitch-alarm-queue-message.model';
import { PaginatedResultsModel } from 'src/models/pagination.model';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';
import { SendMailModel } from 'src/models/send-mail.model';
import { AlarmAutomatedActionsService } from '../alarm-filter-config/alarm-automated-actions.service';
import {
  AlarmFilterPeriod,
  AlarmStatus,
  APP_CONSTANTS,
  APP_MESSAGES,
  DATE_FORMATS,
} from 'src/common/enums/enums';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { TransmissionTrendsFilterConditionsModel } from 'src/models/trends.model';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { LdiSoftswitchTrunkGroup } from 'src/entities/ldi-softswitch-trunk-group.entity';

@Injectable()
export class LdiSoftSwitchAlarmService extends BaseService<LdiSoftswitchEmsAlarm> {
  private readonly alarmJoins = [
    'ldiSoftswitchTrunkGroup',
    'alarm_filter_config',
  ];
  constructor(
    private readonly ldiSoftSwitchAlarmRepository: LdiSoftSwitchAlarmRepository,
    private readonly alarmAutomatedActionsService: AlarmAutomatedActionsService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly emailQueueService: EmailQueueService,
    private helperFunctions: HelperFunctions,
  ) {
    super(ldiSoftSwitchAlarmRepository);
  }

  async findAllPaginated(
    filterData: LdiSoftswitchAlarmsFilterModel,
  ): Promise<PaginatedResultsModel> {
    const searchColumn = [
      'trunk_group',
      'message_state',
      'type_txt',
      'severity',
    ];
    return this.ldiSoftSwitchAlarmRepository.findAllWithPagination(
      filterData,
      searchColumn,
    );
  }
  async recoverAlarm(payload: LdiSoftySwitchAlarms) {
    const alarm = await this.findByCondition(
      {
        source_ip: payload.source_ip,
        type_txt: payload.type_txt,
        subtype_txt: payload.subtype_txt,
        trunk_group: payload.trunk_group,
        is_cleared: false,
      },
      {
        created_on: 'DESC',
      },
      ['alarm_filter_config'],
    );

    if (alarm) {
      alarm.cleared_on = new Date(payload.event_time);
      alarm.is_cleared = true;
      await this.update({ id: alarm.id }, alarm);
    }
    return alarm;
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

  public async getAlarmEmailTemplate(alarmId: number) {
    const alarm = await this.findByCondition(
      {
        id: alarmId,
      },
      null,
      [...this.alarmJoins],
    );
    return this.emailTemplatesService.getLdiSoftswitchmEmailTemplate(alarm);
  }

  public async sendLdiSoftswitchAlarmMail(
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
      await this.emailTemplatesService.getLdiSoftswitchmEmailTemplate(alarm);
    return this.emailQueueService.addJobInQueue({ ...sendMailModel });
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
    from ldi_softswitch_ems_alarm na
    right join (select distinct severity as 'severity' from ldi_softswitch_ems_alarm) st
      on st.severity = na.severity  and  ${condition}
    group by st.severity
    UNION ALL
    SELECT 'total', COUNT(na.id) AS 'alarm_count'
    FROM ldi_softswitch_ems_alarm na
    WHERE ${condition}
    `;
    const rawCount = await this.ldiSoftSwitchAlarmRepository.executeRawQuery(
      query,
    );
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
    const queryBuilder =
      this.ldiSoftSwitchAlarmRepository.getSelectQueryBuilder();
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

  async getLdiSoftswitchAlarmsCountBySeverity(
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
      .groupBy('na.alarm_filter_config_id')
      .orderBy('alarm_count', 'DESC')
      .limit(10);
    return queryBuilder.getRawMany();
  }

  async getTopTenTrunkGroupByAlarmCount(
    trendFilterConditions: TransmissionTrendsFilterConditionsModel,
  ) {
    const queryBuilder = this.getQueryBuilderWithTransmissionTrendConditions(
      trendFilterConditions,
    );
    queryBuilder
      .select(['nne.trunk_name', 'COUNT(na.id) as alarm_count'])
      .innerJoin(
        LdiSoftswitchTrunkGroup,
        'nne',
        'nne.id = na.ldi_softswitch_trunk_group_id',
      )
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
