import { Injectable } from '@nestjs/common';
import { NceAlarmsService } from '../nce-alarms/nce-alarms.service';
import {
  APP_CONSTANTS,
  AlarmFilterPeriod,
  AlarmStatus,
  AppType,
  TrendType,
} from 'src/common/enums/enums';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { ObsAlertsService } from '../obs-alerts/obs-alerts.service';
import {
  IpTrendsFilterConditionsModel,
  IpTrendsModel,
  TransmissionTrendsFilterConditionsModel,
  TransmissionTrendsModel,
} from 'src/models/trends.model';
import { plainToInstance } from 'class-transformer';
import { IpTrendsFilterConditionsDTO } from 'src/dto/trends/trends.dto';
import { NceGponAlarmsService } from '../nce-gpon-alarms/nce-gpon-alarms.service';
import { NokiaTxnAlarmsService } from '../nokia-txn-alarms/nokia-txn-alarms.service';
import { LdiSoftSwitchAlarmService } from '../ldi-softswitch-alarm/ldi-softswitch-alarm.service';

@Injectable()
export class DashboardStatsService {
  constructor(
    private readonly nceAlarmService: NceAlarmsService,
    private readonly obsAlertService: ObsAlertsService,
    private readonly nceGponAlarmsService: NceGponAlarmsService,
    private readonly nokiaTxnAlarmsService: NokiaTxnAlarmsService,
    private helperFunctionsService: HelperFunctions,
    private readonly ldiSoftSwitchAlarmService: LdiSoftSwitchAlarmService,
  ) {}
  async getNceAlarmsTrends(transmissionTrendsModel: TransmissionTrendsModel) {
    const { trend_type: trendType } = transmissionTrendsModel;
    const transmissionTrendsFilterConditions: TransmissionTrendsFilterConditionsModel =
      plainToInstance(
        TransmissionTrendsFilterConditionsModel,
        transmissionTrendsModel,
      );
    let trend: any;

    if (trendType == TrendType.SEVERITY) {
      trend = await this.nceAlarmService.getNceAlarmsCountBySeverity(
        transmissionTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_ALARMS) {
      trend = await this.nceAlarmService.getTopTenAlarms(
        transmissionTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_DEVICES) {
      trend = await this.nceAlarmService.getTopTenDevicesByAlarmCount(
        transmissionTrendsFilterConditions,
      );
    }

    if (transmissionTrendsModel.alarm_filter_config_id && !trendType) {
      trend = await this.nceAlarmService.getDashboardWidgetTrend(
        transmissionTrendsFilterConditions,
      );
    }

    const transformedTrend =
      this.helperFunctionsService.transformDataForDashboardView(
        trend,
        APP_CONSTANTS.DASHBOARD_STATS_FROMAT.BAR_CHART,
      );
    return transformedTrend;
  }

  async getObsAlertsTrends(ipTrendsModel: IpTrendsModel) {
    const { trend_type: trendType } = ipTrendsModel;
    const IpTrendsFilterConditions: IpTrendsFilterConditionsModel =
      plainToInstance(IpTrendsFilterConditionsModel, ipTrendsModel);
    let trend: any;

    if (trendType == TrendType.SEVERITY) {
      trend = await this.obsAlertService.getObsAlertsCountBySeverity(
        IpTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_ALARMS) {
      trend = await this.obsAlertService.getTopTenAlerts(
        IpTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_DEVICES) {
      trend = await this.obsAlertService.getTopTenDevicesByAlertCount(
        IpTrendsFilterConditions,
      );
    }

    if (ipTrendsModel.alarm_filter_config_id && !trendType) {
      trend = await this.obsAlertService.getDashboardWidgetTrend(
        IpTrendsFilterConditions,
      );
    }
    const transformedTrend =
      this.helperFunctionsService.transformDataForDashboardView(
        trend,
        APP_CONSTANTS.DASHBOARD_STATS_FROMAT.BAR_CHART,
      );
    return transformedTrend;
  }

  async getNceGponAlarmsTrends(
    transmissionTrendsModel: TransmissionTrendsModel,
  ) {
    const { trend_type: trendType } = transmissionTrendsModel;
    const transmissionTrendsFilterConditions: TransmissionTrendsFilterConditionsModel =
      plainToInstance(
        TransmissionTrendsFilterConditionsModel,
        transmissionTrendsModel,
      );
    let trend: any;

    if (trendType == TrendType.SEVERITY) {
      trend = await this.nceGponAlarmsService.getNceGponAlarmsCountBySeverity(
        transmissionTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_ALARMS) {
      trend = await this.nceGponAlarmsService.getTopTenAlarms(
        transmissionTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_DEVICES) {
      trend = await this.nceGponAlarmsService.getTopTenDevicesByAlarmCount(
        transmissionTrendsFilterConditions,
      );
    }

    if (transmissionTrendsModel.alarm_filter_config_id && !trendType) {
      trend = await this.nceGponAlarmsService.getDashboardWidgetTrend(
        transmissionTrendsFilterConditions,
      );
    }

    const transformedTrend =
      this.helperFunctionsService.transformDataForDashboardView(
        trend,
        APP_CONSTANTS.DASHBOARD_STATS_FROMAT.BAR_CHART,
      );
    return transformedTrend;
  }

  async getNokiaTxnAlarmsTrends(
    transmissionTrendsModel: TransmissionTrendsModel,
  ) {
    const { trend_type: trendType } = transmissionTrendsModel;
    const transmissionTrendsFilterConditions: TransmissionTrendsFilterConditionsModel =
      plainToInstance(
        TransmissionTrendsFilterConditionsModel,
        transmissionTrendsModel,
      );
    let trend: any;

    if (trendType == TrendType.SEVERITY) {
      trend = await this.nokiaTxnAlarmsService.getNokiaTxnAlarmsCountBySeverity(
        transmissionTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_ALARMS) {
      trend = await this.nokiaTxnAlarmsService.getTopTenAlarms(
        transmissionTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_DEVICES) {
      trend = await this.nokiaTxnAlarmsService.getTopTenDevicesByAlarmCount(
        transmissionTrendsFilterConditions,
      );
    }

    if (transmissionTrendsModel.alarm_filter_config_id && !trendType) {
      trend = await this.nokiaTxnAlarmsService.getDashboardWidgetTrend(
        transmissionTrendsFilterConditions,
      );
    }

    const transformedTrend =
      this.helperFunctionsService.transformDataForDashboardView(
        trend,
        APP_CONSTANTS.DASHBOARD_STATS_FROMAT.BAR_CHART,
      );
    return transformedTrend;
  }

  async getNceAlarmCount(status?: AlarmStatus, period?: AlarmFilterPeriod) {
    return this.nceAlarmService.getAlarmsCount(status, period);
  }

  async getNceGponAlarmCount(status?: AlarmStatus, period?: AlarmFilterPeriod) {
    return this.nceGponAlarmsService.getAlarmsCount(status, period);
  }

  async getObsAlertsCount(status?: AlarmStatus, period?: AlarmFilterPeriod) {
    return this.obsAlertService.getAlertsCount(status, period);
  }

  async getNokiaTxnAlarmCount(
    status?: AlarmStatus,
    period?: AlarmFilterPeriod,
  ) {
    return this.nokiaTxnAlarmsService.getAlarmsCount(status, period);
  }

  async getLdiSoftswitchAlarmCount(
    status?: AlarmStatus,
    period?: AlarmFilterPeriod,
  ) {
    return this.ldiSoftSwitchAlarmService.getAlarmsCount(status, period);
  }

  async getLdiSoftswitchAlarmsTrends(
    transmissionTrendsModel: TransmissionTrendsModel,
  ) {
    const { trend_type: trendType } = transmissionTrendsModel;
    const transmissionTrendsFilterConditions: TransmissionTrendsFilterConditionsModel =
      plainToInstance(
        TransmissionTrendsFilterConditionsModel,
        transmissionTrendsModel,
      );
    let trend: any;

    if (trendType == TrendType.SEVERITY) {
      trend =
        await this.ldiSoftSwitchAlarmService.getLdiSoftswitchAlarmsCountBySeverity(
          transmissionTrendsFilterConditions,
        );
    } else if (trendType == TrendType.TOP_TEN_ALARMS) {
      trend = await this.ldiSoftSwitchAlarmService.getTopTenAlarms(
        transmissionTrendsFilterConditions,
      );
    } else if (trendType == TrendType.TOP_TEN_TRUNK_GROUP) {
      trend =
        await this.ldiSoftSwitchAlarmService.getTopTenTrunkGroupByAlarmCount(
          transmissionTrendsFilterConditions,
        );
    }

    if (transmissionTrendsModel.alarm_filter_config_id && !trendType) {
      trend = await this.ldiSoftSwitchAlarmService.getDashboardWidgetTrend(
        transmissionTrendsFilterConditions,
      );
    }

    const transformedTrend =
      this.helperFunctionsService.transformDataForDashboardView(
        trend,
        APP_CONSTANTS.DASHBOARD_STATS_FROMAT.BAR_CHART,
      );
    return transformedTrend;
  }
}
