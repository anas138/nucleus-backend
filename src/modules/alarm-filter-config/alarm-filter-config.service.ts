import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { AlarmFilterConfigRepository } from './alarm-filter-config.repository';
import { HelperFunctions } from 'src/common/util/helper-functions';
import {
  AlarmFilterConfigModel,
  CreateALarmFilterConfigModel,
  FetchAlarmFilterConfigModel,
} from 'src/models/alarm-filter-config.model';
import {
  APP_CONSTANTS,
  AppType,
  DROP_DOWN_CATEGORY_CONSTANTS,
  EscalationType,
  OBSERVIUM_ALERT_SEVERITY,
  RecordStatus,
} from 'src/common/enums/enums';
import { AlarmFilterAdvanceConditionService } from '../alarm-filter-advance-condition/alarm-filter-advance-condition.service';
import {
  AlarmFilterAdvanceConditionModel,
  CreateALarmFilterAdvanceConditionModel,
  FetchAlarmFilterAdvanceConditionModel,
} from 'src/models/alarm-filter-advance-condition.model';
import {
  DataSource,
  FindOptionsWhere,
  In,
  Repository,
  Raw,
  Not,
} from 'typeorm';
import { NCEAlarmModel } from 'src/models/nce-alarm.model';
import { AlarmFilterAdvanceCondition } from 'src/entities/alarm-filter-advance-condition.entity';
import { AlarmRecipientService } from '../alarm-recipient/alarm-recipient.service';
import { AlarmRecipient } from 'src/entities/alarm-recipient.entity';
import { NceNetworkElementService } from '../nce-network-element/nce-network-element.service';
import { NceNetworkElement } from 'src/entities/nce-network-element.entity';
import { UserService } from '../user/user.service';
import { IObsAlert } from 'src/models/obs-alert.model';
import {
  AlarmFilterConfigQueryParam,
  CreateAlarmFilterModel,
  FetchAlarmFilterModel,
  UpdateAlarmFilterModel,
} from 'src/models/alarm-filter.model';
import {
  AlarmRecipientModel,
  FetchAlarmRecipientMappedModel,
  transformAlarmRecipient,
} from 'src/models/alarm-recipient.model';
import { DropDownItem } from 'src/entities/drop-down-item.entity';
import { DropDownItemsService } from '../drop-down/drop-down-item.service';
import { AlarmDelayedActionsService } from 'src/microservices/queues/alarm-delayed-actions/alarm-delayed-actions.service';
import { ObsDeviceService } from '../obs-device/obs-device.service';
import { AlarmFilterEscalationDeviceService } from '../alarm-filter-escalation-device/alarm-flter-escalation-device.service';
import { ObsAlertsService } from '../obs-alerts/obs-alerts.service';
import { ObserviumDevice } from 'src/entities/obs-device.entity';
import { NokiaTxnAlarmModel } from 'src/models/nokia-txn-alarm.model';

@Injectable()
export class AlarmFilterConfigService extends BaseService<AlarmFilterConfig> {
  constructor(
    private dataSource: DataSource,
    private readonly repo: AlarmFilterConfigRepository,
    private readonly alarmFilterAdvanceConditionService: AlarmFilterAdvanceConditionService,
    private readonly alarmRecipientService: AlarmRecipientService,
    private readonly helperFunctions: HelperFunctions,
    private readonly dropDownItemsService: DropDownItemsService,
    private alarmDelayedActionService: AlarmDelayedActionsService,
    private alarmFilterEscalationDeviceService: AlarmFilterEscalationDeviceService,
  ) {
    super(repo);
  }

  async extractAlarmFilterConfigurationFromCsv() {
    const nceAlarms: any = await this.readNceAlarms();
    // const observiumAlertsConfig = await this.readObserviumALerts();
    // for (let alertConfig of observiumAlertsConfig) {
    //   const alarmFilterConfigPayload: CreateALarmFilterModel = this.getMappedObserviumALert(alertConfig)
    // }
    for (let alarm of nceAlarms) {
      const alarmFilterConfigPayload: CreateALarmFilterConfigModel =
        this.getMappedNceALarm(alarm);
      const alarmFilterConfig = await this.repo.create(
        alarmFilterConfigPayload,
      );
      // this.getMappedNceAlarmConditionsPayload(alarm)
      const condition = alarm['Condition'];
      if (condition) {
        await this.alarmFilterAdvanceConditionService.create(
          this.getMappedNceAlarmConditionsPayload(alarm, alarmFilterConfig.id),
        );
      }
    }
    return { nceAlarms };
  }

  private getMappedNceAlarmConditionsPayload(
    alarm,
    alarmFilterConfigId?: number,
  ): CreateALarmFilterAdvanceConditionModel {
    let payload: any = { alarm_filter_config_id: alarmFilterConfigId };
    const condition = alarm['Condition'];
    const delimiters = ['contains', 'contain'];
    const pattern = new RegExp(delimiters.join('|'), 'g');
    const [fieldName, fieldValue] = condition.split(pattern);
    payload = {
      ...payload,
      field_name: fieldName.trim(),
      field_value: fieldValue.trim(),
    };
    return payload;
  }

  private getMappedNceALarm(alarm): CreateALarmFilterConfigModel {
    let mappedAlarm: any = {};
    const specialRequirments = alarm['Special Requirement'];
    if (specialRequirments) {
      if (
        specialRequirments.includes('Region Segregation') ||
        (specialRequirments.includes('Region') &&
          specialRequirments.includes('segregated'))
      ) {
        mappedAlarm.is_regional_esaclation = true;
      } else {
        mappedAlarm.is_regional_esaclation = false;
      }
    }
    return {
      ...mappedAlarm,
      alarm_name: alarm['Name'],
      severity: alarm['Severity'],
      app_type: AppType.NCE,
    };
  }

  private async readNceAlarms() {
    const filePath = `${process.cwd()}/docs/NCE/Alarms.xlsx`;
    const alarms = await this.helperFunctions.readXLSX(filePath);
    return alarms;
  }

  private async readObserviumALerts() {
    const filePath = `${process.cwd()}/docs/OBS/Alerts-Details.xlsx`;
    const alerts = await this.helperFunctions.readXLSX(filePath);
    return alerts;
  }

  parseNceAlarm(
    alarm: NCEAlarmModel | NokiaTxnAlarmModel,
    appType: AppType,
  ): [
      () => Promise<Boolean>,
      (id: number, device: string) => Promise<void>,
      () => number,
    ] {
    let matchedAlarmFilterConfig: AlarmFilterConfig;
    const isValid = async () => {
      matchedAlarmFilterConfig = await getMatchedNceAlarmConfig();
      if (matchedAlarmFilterConfig) {
        const alarmFilterConfigId = matchedAlarmFilterConfig.id;
        const advanceConditions = await this.getAdvanceConditions(
          alarmFilterConfigId,
        );
        if (advanceConditions && advanceConditions.length) {
          if (doesAdvanceConditionMatch(advanceConditions)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
      return false;
    };
    /**
     * @description this function pushes email, sms or TT to alarmDelayedActions queue
     */
    const escalate = async (id: number, device: string) => {
      if (matchedAlarmFilterConfig.is_email_escalation) {
        this.alarmDelayedActionService.addJobInQueue(
          {
            alarmConfigId: matchedAlarmFilterConfig.id,
            alarmId: id,
            appType: appType,
            escalationType: EscalationType.EMAIL,
          },
          matchedAlarmFilterConfig.email_escalation_delay,
        );
      }

      if (matchedAlarmFilterConfig.is_ticket_escalation) {
        const alarmFilterConfig = matchedAlarmFilterConfig;

        if (
          alarmFilterConfig.escalationTicketDevices?.length &&
          alarmFilterConfig.escalationTicketDevices.some(
            (ticketDevice) => ticketDevice.nce_device_id !== device,
          )
        ) {
          return null;
        } else {
          this.alarmDelayedActionService.addJobInQueue(
            {
              alarmConfigId: matchedAlarmFilterConfig.id,
              alarmId: id,
              appType: appType,
              escalationType: EscalationType.TROUBLE_TICKET,
            },
            matchedAlarmFilterConfig.ticket_escalation_delay,
          );
        }
      }
    };
    const getMatchedNceAlarmConfig = async (): Promise<AlarmFilterConfig> => {
      const alarmName = alarm['native_probable_cause'] ?? alarm['alarm_name'];
      if (alarmName) {
        const severities =
          await this.getAlarmSeveritiesByMinimumLookUpSeverityGivenAppType(
            appType,
            alarm.severity,
          );

        const where: FindOptionsWhere<AlarmFilterConfig> = {
          alarm_name: alarmName,
          severity: In(severities),
          record_status: RecordStatus.ACTIVE,
          app_type: appType,
        };
        return this.repo.findByCondition(where, null, [
          'escalationTicketDevices',
        ]);
      }
      return null;
    };
    const doesAdvanceConditionMatch = (
      conditions: FetchAlarmFilterAdvanceConditionModel[],
    ) => {
      for (let condition of conditions) {
        //renmae incomingCondition
        const incomingCondition: string = alarm[condition.field_name];
        const existingConditions = condition.field_value;
        const searchCriteria = condition.search_criteria;
        if (incomingCondition) {
          for (let existingCondition of existingConditions.split(',')) {
            // apply search criteria here
            if (searchCriteria === APP_CONSTANTS.SEARCH_CRITERIA.CONTAINS) {
              if (incomingCondition.includes(existingCondition.trim())) {
                return true;
              }
            }
          }
        } else {
          break;
        }
      }
      return false;
    };
    const getMatchedAlarmFilterConfigId = () =>
      matchedAlarmFilterConfig ? matchedAlarmFilterConfig.id : null;
    return [isValid, escalate, getMatchedAlarmFilterConfigId];
  }

  private getAlarmRecipients(alarmFilterConfig: AlarmFilterConfig) {
    const where: FindOptionsWhere<AlarmRecipient> = {
      alarm_filter_config_id: alarmFilterConfig.id,
    };
    return this.alarmRecipientService.findAll({
      where,
    });
  }

  private async getAdvanceConditions(
    alarmFilterConfigId: number,
  ): Promise<FetchAlarmFilterAdvanceConditionModel[]> {
    const where: FindOptionsWhere<AlarmFilterAdvanceCondition> = {
      alarm_filter_config_id: alarmFilterConfigId,
    };
    return this.alarmFilterAdvanceConditionService.findAll({
      where,
    });
  }

  private getMappedObserviumALert(alertRule) {
    let mappedAlert: CreateALarmFilterConfigModel;
    mappedAlert = {
      ...mappedAlert,
      alarm_name: alertRule['Alert Name'],
      app_type: AppType.OBSERVIUM,
      severity: alertRule['Severity'],
    };

    return;
  }

  /**
   * @description This parses Observium alert to validate and escalate
   * @param observiumAlert
   */
  parseObsAlert(
    obsAlert: IObsAlert,
  ): [
      () => Promise<Boolean>,
      (id: number, device: ObserviumDevice) => Promise<void>,
      () => number,
    ] {
    let matchedAlarmFilterConfig: FetchAlarmFilterConfigModel;
    let advanceConditions: FetchAlarmFilterAdvanceConditionModel[];

    const isValid = async () => {
      const severities =
        await this.getAlarmSeveritiesByMinimumLookUpSeverityGivenAppType(
          AppType.OBSERVIUM,
          obsAlert.alert_severity,
        );
      const where: FindOptionsWhere<FetchAlarmFilterAdvanceConditionModel> = {
        alarm_filter_config: {
          app_type: AppType.OBSERVIUM,
          severity: In(severities),
          record_status: RecordStatus.ACTIVE,
        },
      };
      advanceConditions = await this.alarmFilterAdvanceConditionService.findAll(
        {
          where,
          relations: [
            'alarm_filter_config',
            'alarm_filter_config.escalationTicketDevices',
          ],
        },
      );
      for (let advanceCondition of advanceConditions) {
        const isCriteriaMatched = checkIfCriteriaMatches(advanceCondition);
        if (isCriteriaMatched) {
          matchedAlarmFilterConfig = advanceCondition.alarm_filter_config;
          return true;
        }
      }
      return false;
    };
    const checkIfCriteriaMatches = (
      condition: FetchAlarmFilterAdvanceConditionModel,
    ): Boolean => {
      const {
        field_name: searchColumn,
        field_value: searchValues,
        search_criteria: criteria,
      } = condition;
      if (criteria === APP_CONSTANTS.SEARCH_CRITERIA.CONTAINS) {
        const splittedSearchValues = searchValues.split(',');
        for (let searchValue of splittedSearchValues) {
          if (!obsAlert[searchColumn].includes(searchValue)) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    /**
     * @description this function pushes email, sms or TT to alarmDelayedActions queue
     */
    const escalate = async (alarmid: number, device: ObserviumDevice) => {
      matchedAlarmFilterConfig.is_email_escalation &&
        this.alarmDelayedActionService.addJobInQueue(
          {
            alarmConfigId: matchedAlarmFilterConfig.id,
            alarmId: alarmid,
            appType: AppType.OBSERVIUM,
            escalationType: EscalationType.EMAIL,
          },
          matchedAlarmFilterConfig.email_escalation_delay,
        );
      const alarmFilterConfig = matchedAlarmFilterConfig;

      if (matchedAlarmFilterConfig.is_ticket_escalation) {
        if (
          alarmFilterConfig.escalationTicketDevices?.length &&
          alarmFilterConfig.escalationTicketDevices.some(
            (ticketDevice) => +ticketDevice.obs_device_id !== device.device_id,
          )
        ) {
          return null;
        } else {
          this.alarmDelayedActionService.addJobInQueue(
            {
              alarmConfigId: matchedAlarmFilterConfig.id,
              alarmId: alarmid,
              appType: AppType.OBSERVIUM,
              escalationType: EscalationType.TROUBLE_TICKET,
            },
            matchedAlarmFilterConfig.ticket_escalation_delay,
          );
        }
      }
    };
    const getMatchedAlarmFilterConfigId = () =>
      matchedAlarmFilterConfig ? matchedAlarmFilterConfig.id : null;

    return [isValid, escalate, getMatchedAlarmFilterConfigId];
  }

  parseLdiSoftswitchAlarm(
    alarm: any,
  ): [
      () => Promise<Boolean>,
      (id: number, trunkGroupId: number) => Promise<void>,
      () => any,
    ] {
    let matchedAlarmFilterConfig: FetchAlarmFilterConfigModel;
    let advanceConditions: any;

    const isValid = async () => {
      const severities =
        await this.getAlarmSeveritiesByMinimumLookUpSeverityGivenAppType(
          AppType.LDI_SOFTSWITCH_EMS,
          alarm.severity,
        );
      const where: FindOptionsWhere<FetchAlarmFilterAdvanceConditionModel> = {
        alarm_filter_config: {
          app_type: AppType.LDI_SOFTSWITCH_EMS,
          severity: In(severities),
          record_status: RecordStatus.ACTIVE,
        },
      };
      advanceConditions = await this.alarmFilterAdvanceConditionService.findAll(
        {
          where,
          relations: ['alarm_filter_config'],
        },
      );
      for (let advanceCondition of advanceConditions) {
        const isCriteriaMatched = checkIfCriteriaMatches(advanceCondition);
        if (isCriteriaMatched) {
          matchedAlarmFilterConfig = advanceCondition.alarm_filter_config;
          return true;
        }
      }
      return false;
    };
    const checkIfCriteriaMatches = (
      condition: FetchAlarmFilterAdvanceConditionModel,
    ): Boolean => {
      const {
        field_name: searchColumn,
        field_value: searchValues,
        search_criteria: criteria,
      } = condition;
      if (criteria === APP_CONSTANTS.SEARCH_CRITERIA.CONTAINS) {
        const splittedSearchValues = searchValues.split(',');
        for (let searchValue of splittedSearchValues) {
          if (!alarm[searchColumn].includes(searchValue)) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    /**
     * @description this function pushes email, sms or TT to alarmDelayedActions queue
     */
    const escalate = async (alarmid: number, trunkGroupId: number) => {
      matchedAlarmFilterConfig.is_email_escalation &&
        this.alarmDelayedActionService.addJobInQueue(
          {
            alarmConfigId: matchedAlarmFilterConfig.id,
            alarmId: alarmid,
            appType: AppType.LDI_SOFTSWITCH_EMS,
            escalationType: EscalationType.EMAIL,
          },
          matchedAlarmFilterConfig.email_escalation_delay,
        );
      const alarmFilterConfig = matchedAlarmFilterConfig;

      if (matchedAlarmFilterConfig.is_ticket_escalation) {
        if (
          alarmFilterConfig.escalationTicketDevices?.length &&
          alarmFilterConfig.escalationTicketDevices.some(
            (ticketDevice) =>
              +ticketDevice.ldi_softswitch_trunk_group_id !== trunkGroupId,
          )
        ) {
          return null;
        } else {
          this.alarmDelayedActionService.addJobInQueue(
            {
              alarmConfigId: matchedAlarmFilterConfig.id,
              alarmId: alarmid,
              appType: AppType.LDI_SOFTSWITCH_EMS,
              escalationType: EscalationType.TROUBLE_TICKET,
            },
            matchedAlarmFilterConfig.ticket_escalation_delay,
          );
        }
      }
    };
    const getMatchedAlarmFilterConfigId = () =>
      matchedAlarmFilterConfig ? matchedAlarmFilterConfig : null;

    return [isValid, escalate, getMatchedAlarmFilterConfigId];
  }

  async createAlarmFilter(
    payload: CreateAlarmFilterModel,
  ): Promise<NCEAlarmModel | any> {
    const {
      alarm_filter_config,
      alarm_filter_advanced_conditions,
      alarm_recipients,
      escalation_ticket,
    } = payload;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const alarmFilterName = await this.repo.findByCondition({
        alarm_name: Raw(
          (alias) => `LOWER(TRIM(${alias})) = LOWER(TRIM(:alarm_name))`,
          { alarm_name: alarm_filter_config.alarm_name },
        ),
      });
      if (alarmFilterName) {
        throw new Error(
          ' Duplicate Alarm Name. Please add a different name for the alarm',
        );
      }

      let alarmFilterPayload = null;

      alarmFilterPayload = {
        ...alarm_filter_config,
      };

      if (escalation_ticket) {
        const { ticket_escalation_device, ...otherPayload } = escalation_ticket;
        alarmFilterPayload = {
          ...alarm_filter_config,
          ...otherPayload,
        };
      }
      const alarmFilterConfigData = await this.repo.create(
        alarmFilterPayload,
        queryRunner.manager,
      );

      /**
       * @description store devices if available
       */
      if (escalation_ticket?.ticket_escalation_device) {
        await this.alarmFilterEscalationDeviceService.createAndUpdate(
          escalation_ticket.ticket_escalation_device,
          alarmFilterConfigData,
          queryRunner,
        );
      }

      const alarmFilterAdvanceConditionData = await Promise.all(
        alarm_filter_advanced_conditions.map(
          async (alarmFilterAdvanceCondition) => {
            const alarmFilterAdvanceConditionPayload = {
              ...alarmFilterAdvanceCondition,
              alarm_filter_config_id: alarmFilterConfigData.id,
            };
            return this.alarmFilterAdvanceConditionService.create(
              alarmFilterAdvanceConditionPayload,
              queryRunner.manager,
            );
          },
        ),
      );
      const alarmRecipientData = await Promise.all(
        alarm_recipients.map(async (alarmRecipient) => {
          const alarmRecipientsPayload: Partial<AlarmRecipient> = {
            recipient_type: alarmRecipient.recipient_type,
            [alarmRecipient.recipient]: alarmRecipient.recipient_id,
            alarm_filter_config_id: alarmFilterConfigData.id,
            created_by: alarmRecipient.created_by,
          };
          return this.alarmRecipientService.create(
            alarmRecipientsPayload,
            queryRunner.manager,
          );
        }),
      );
      await queryRunner.commitTransaction();
      return {
        alarm_filter_config: alarmFilterConfigData,
        alarm_filter_advanced_conditions: alarmFilterAdvanceConditionData,
        alarm_recipients: alarmRecipientData,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }

    return {};
  }

  async getALarmNamesByAppType(appType: AppType): Promise<string[]> {
    const where: FindOptionsWhere<AlarmFilterConfig> = {
      app_type: appType,
      record_status: RecordStatus.ACTIVE,
    };
    const alarmFilterConfig = await this.repo.findAll({ where });
    const alarmNames = alarmFilterConfig.map((alarmFilter) => {
      return alarmFilter.alarm_name;
    });
    const uniqueAlarmNames = new Set(alarmNames);
    return [...uniqueAlarmNames];
  }

  async updateAlarmFilter(
    alertConfigId: number,
    updateAlarmFilterModel: UpdateAlarmFilterModel,
  ): Promise<void> {
    const {
      alarm_filter_config,
      alarm_filter_advanced_conditions,
      alarm_recipients,
      escalation_ticket,
    } = updateAlarmFilterModel;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      if (!alarm_filter_config.is_change_in_display_severity) {
        alarm_filter_config.conditional_severity = null;
        alarm_filter_config.severity_to_be_displayed = null;
      }
      await this.updateWithTransactionScope(
        { id: alertConfigId },
        alarm_filter_config,
        queryRunner.manager,
      );

      /**
       * @description soft delete alarm alarm filter config which not included in alarm_filter_advanced_conditions
       */
      const alarm_filter_advanced_conditions_id = this.extractIds(
        alarm_filter_advanced_conditions,
      );
      await this.findAndUpdateService(
        this.alarmFilterAdvanceConditionService,
        alarm_filter_advanced_conditions_id,
        alertConfigId,
      );

      /**
       * @description soft delete alarm recipient which not included in alarm_recipients
       */
      const alarm_recipients_id = this.extractIds(alarm_recipients);
      await this.findAndUpdateService(
        this.alarmRecipientService,
        alarm_recipients_id,
        alertConfigId,
      );

      await Promise.all(
        alarm_filter_advanced_conditions.map(
          async (alarm_filter_advanced_condition) => {
            alarm_filter_advanced_condition.alarm_filter_config_id =
              alertConfigId;
            const { id, ...payload } = alarm_filter_advanced_condition;
            if (id) {
              await this.alarmFilterAdvanceConditionService.updateWithTransactionScope(
                { id },
                payload,
                queryRunner.manager,
              );
            } else {
              await this.alarmFilterAdvanceConditionService.create(
                payload,
                queryRunner.manager,
              );
            }
          },
        ),
      );
      if (alarm_recipients.length) {
        await Promise.all(
          alarm_recipients.map(async (alarm_recipient) => {
            alarm_recipient.alarm_filter_config_id = alertConfigId;
            const { id, ...payload } = alarm_recipient;
            const alarmRecipientsPayload: Partial<AlarmRecipient> = {
              recipient_type: payload.recipient_type,
              [payload.recipient]: payload.recipient_id,
              alarm_filter_config_id: payload.alarm_filter_config_id,
              updated_by: alarm_recipient.updated_by,
            };
            if (id) {
              await this.alarmRecipientService.updateAlarmRecipientWithTransactionScope(
                { id },
                alarmRecipientsPayload,
                queryRunner.manager,
              );
            } else {
              await this.alarmRecipientService.create(
                alarmRecipientsPayload,
                queryRunner.manager,
              );
            }
          }),
        );
      }

      if (escalation_ticket) {
        const where: FindOptionsWhere<AlarmFilterConfig> = {
          id: alertConfigId,
        };
        await this.updateWithTransactionScope(
          where,
          {
            ...alarm_filter_config,
            ...escalation_ticket,
          },
          queryRunner.manager,
        );

        await this.alarmFilterEscalationDeviceService.createAndUpdate(
          escalation_ticket.ticket_escalation_device,
          { ...alarm_filter_config, id: alertConfigId },
          queryRunner,
        );
      }

      if (!escalation_ticket) {
        const where: FindOptionsWhere<AlarmFilterConfig> = {
          id: alertConfigId,
        };
        const payload = {
          is_ticket_escalation: false,
          ticket_escalation_initial_sub_department: null,
          ticket_escalation_medium: null,
          can_revert_ticket_on_alarm_recovery: false,
          ticket_escalation_category: null,
          ticket_escalation_sub_category: null,
          ticket_escalation_delay: 0,
        };
        await this.updateWithTransactionScope(
          where,
          { ...alarm_filter_config, ...payload },
          queryRunner.manager,
        );
      }
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  extractIds(condition: any[]) {
    const ids: number[] = condition
      .filter((cond) => {
        if (cond) return cond.id;
      })
      .map((cond) => cond.id);

    return ids;
  }

  async findAndUpdateService(
    service: AlarmFilterAdvanceConditionService | AlarmRecipientService,
    ids: number[],
    alertConfigId: number,
  ) {
    const advancedCondition = await service.findAll({
      where: {
        id: Not(In(ids)),
        alarm_filter_config_id: alertConfigId,
        record_status: RecordStatus.ACTIVE,
      },
    });

    await service.updateWithCondition(
      { id: In(advancedCondition.map((cond) => cond.id)) },
      { record_status: RecordStatus.DELETED },
    );
  }

  async getAlarmFilterById(id: number): Promise<any> {
    const data = await this.dataSource
      .createQueryBuilder(AlarmFilterConfig, 'alarm_filter_config')
      .leftJoinAndSelect(
        'alarm_filter_config.alarm_filter_advanced_conditions',
        'adv',
        'adv.record_status = :status',
        { status: RecordStatus.ACTIVE },
      )
      .leftJoinAndSelect(
        'alarm_filter_config.alarm_recipients',
        'recipients',
        'recipients.record_status = :status',
        { status: RecordStatus.ACTIVE },
      )
      .leftJoinAndSelect(
        'recipients.single_user',
        'single_user',
        'single_user.record_status=:status',
        { status: RecordStatus.ACTIVE },
      )
      .leftJoinAndSelect(
        'recipients.group_user',
        'group_user',
        'group_user.record_status=:status',
        { status: RecordStatus.ACTIVE },
      )
      .leftJoinAndSelect(
        'alarm_filter_config.escalationTicketDevices',
        'escalate_ticket',
      )

      .where('alarm_filter_config.id = :entityId', { entityId: id })
      .orderBy('recipients.id', 'ASC')
      .getOne();

    if (data) {
      const transformedAlarmRecipients: AlarmRecipientModel[] =
        data.alarm_recipients
          .map((alarmRecipient) => {
            if (
              (alarmRecipient?.single_user?.record_status ||
                alarmRecipient?.group_user?.record_status) ===
              RecordStatus.ACTIVE ||
              alarmRecipient.sub_department_id
            ) {
              return transformAlarmRecipient(alarmRecipient);
            }
            return null;
          })
          .filter((transformedRecipient) => transformedRecipient !== null);
      return { ...data, alarm_recipients: [...transformedAlarmRecipients] };
    }
    return data;
  }

  async getAlarmSeveritiesByMinimumLookUpSeverityGivenAppType(
    appType: AppType,
    minimumLookupSeverity: any,
  ): Promise<string[]> {
    let categoryConstant;

    if (appType == AppType.OBSERVIUM) {
      categoryConstant = DROP_DOWN_CATEGORY_CONSTANTS.OBS_ALARM_SEVERITY;
    } else if (appType == AppType.LDI_SOFTSWITCH_EMS) {
      categoryConstant =
        DROP_DOWN_CATEGORY_CONSTANTS.LDI_SOFTSWITCH_ALARM_SEVERITY;
    } else {
      categoryConstant = DROP_DOWN_CATEGORY_CONSTANTS.NCE_ALARM_SEVERITY;
    }
    const dropDownItems: DropDownItem[] =
      await this.dropDownItemsService.getDropDownItemsByCategory(
        categoryConstant,
      );
    if (dropDownItems && dropDownItems.length) {
      const minimumLookupSeveritySequence: number = dropDownItems.find(
        (item) =>
          item.label.toLowerCase() == minimumLookupSeverity.toLowerCase(),
      ).sequence;
      const severities = dropDownItems
        .filter((item) => item.sequence >= minimumLookupSeveritySequence)
        .map((item) => item.label);
      return severities;
    }
  }

  async getAllAlarmsFilterConfig(
    queryParam: AlarmFilterConfigQueryParam,
    appType: AppType,
  ) {
    const { status, is_email_escalation, is_ticket_escalation } = queryParam;

    // Base where conditions
    const where: Partial<AlarmFilterConfig> = {
      app_type: appType,
      ...(status && { record_status: status }),
      ...(is_ticket_escalation && { is_ticket_escalation: Boolean(+is_ticket_escalation) }),
      ...(is_email_escalation && { is_email_escalation: Boolean(+is_email_escalation) }),
    };

    return this.repo.createQueryBuilder('alarmFilterConfig')
      .leftJoinAndSelect('alarmFilterConfig.alarm_filter_advanced_conditions', 'advConds',
        'advConds.record_status = :activeStatus',
        { activeStatus: RecordStatus.ACTIVE }
      )
      .leftJoinAndSelect('alarmFilterConfig.alarm_recipients', 'alarm_recipients')
      .leftJoinAndSelect('alarmFilterConfig.updatedByUser', 'updatedByUser')
      .where(where)
      .orderBy('alarmFilterConfig.updated_at', 'DESC')
      .getMany();
  }

  async getAllAlarms(): Promise<
    { id: number; alarm_name: string; app_type: string }[]
  > {
    return this.findAll({ select: ['id', 'alarm_name', 'app_type'] });
  }
}
