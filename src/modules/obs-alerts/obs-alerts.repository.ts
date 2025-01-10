import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmStatus } from 'src/common/enums/enums';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { IBaseRepository } from 'src/interfaces/base.repository.interface';
import { ObsAlertSearchFilterModel } from 'src/models/obs-alert-search-filter.model';
import { IObsAlert } from 'src/models/obs-alert.model';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { IpTrendsFilterConditionsModel } from 'src/models/trends.model';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import {
  Brackets,
  EntityManager,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class ObsAlertsRepository extends BaseAbstractRepository<ObserviumAlert> {
  constructor(
    @InjectRepository(ObserviumAlert)
    private repo: Repository<ObserviumAlert>,
    private helperFunctions: HelperFunctions,
  ) {
    super(repo);
  }
  async findAllWithPagination(
    obsAlertSearchFilterModel: ObsAlertSearchFilterModel,
    searchColumns: string[],
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(obsAlertSearchFilterModel);

    const query = this.repo.createQueryBuilder('observiumAlert');

    const { take, skip, search, orderBy, orderDirection } =
      calculatedPagination;

    const {
      alarmName,
      alarmFilterConfigId,
      severity,
      devices,
      alarmStatus,
      lastOccurredFrom,
      lastOccurredTo,
      entity_name,
      deviceName,
    } = obsAlertSearchFilterModel;

    const alertTimestampFrom = lastOccurredFrom;
    const alertTimestampTo = lastOccurredTo;
    /**
     * for basic search
     */
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          for (let column of searchColumns) {
            qb.orWhere(`observiumAlert.${column} LIKE :search`, {
              search: `%${search}%`,
            });
          }
        }),
      );
    }

    // Filters
    if (alarmName) {
      let alarm: any;
      try {
        alarm = JSON.parse(alarmName);
      } catch (error) {
        alarm = [alarmName];
      }
      query.andWhere('alarm_filter_config.alarm_name  IN (:...alarm)', {
        alarm: alarm,
      });
    }

    if (alarmFilterConfigId) {
      query.andWhere(
        'observiumAlert.alarm_filter_config_id = :alarmFilterConfigId',
        {
          alarmFilterConfigId,
        },
      );
    }
    if (severity) {
      query.andWhere('observiumAlert.alert_severity = :severity', { severity });
    }
    if (devices) {
      let deviceIds: any;
      try {
        deviceIds = JSON.parse(devices);
      } catch (error) {
        deviceIds = [devices];
      }
      query.andWhere('observiumAlert.device_id IN (:...deviceIds)', {
        deviceIds,
      });
    }
    if (deviceName) {
      query
        .leftJoinAndSelect('observiumAlert.device', 'observium_device')
        .andWhere('observium_device.hostname =:name', {
          name: deviceName,
        });
    }
    if (alarmStatus) {
      const isCleared = alarmStatus === AlarmStatus.CLEARED ? 1 : 0;
      query.andWhere('observiumAlert.is_cleared = :isCleared', { isCleared });
    }

    if (entity_name) {
      query.andWhere(
        'observiumAlert.entity_name LIKE :entity_name OR observiumAlert.entity_description LIKE :entity_name',
        { entity_name: `%${entity_name}%` },
      );
    }
    if (alertTimestampFrom) {
      if (!alertTimestampTo) {
        const now = new Date();
        query.andWhere(
          'observiumAlert.alert_timestamp BETWEEN :alertTimestampFrom AND :now',
          { alertTimestampFrom, now },
        );
      } else {
        query.andWhere(
          'observiumAlert.alert_timestamp BETWEEN :alertTimestampFrom AND :alertTimestampTo',
          { alertTimestampFrom, alertTimestampTo },
        );
      }
    }

    // Fetch and count
    const [obsAlerts, total] = await query
      .leftJoinAndSelect(
        'observiumAlert.alarm_filter_config',
        'alarm_filter_config',
      )
      .orderBy(
        orderBy
          ? { ['observiumAlert.' + orderBy]: orderDirection || 'DESC' }
          : { ['observiumAlert.id']: 'DESC' },
      )
      .take(take)
      .skip(skip)
      .getManyAndCount();
    const basicPaginationProps =
      this.helperFunctions.calculatPaginationProperties(total, take, skip);

    return {
      ...basicPaginationProps,
      list: obsAlerts,
    };
  }

  executeRawQuery(query: string) {
    return this.repo.query(query);
  }

  getSelectQueryBuilder(): SelectQueryBuilder<ObserviumAlert> {
    return this.repo.createQueryBuilder('oa');
  }
}
