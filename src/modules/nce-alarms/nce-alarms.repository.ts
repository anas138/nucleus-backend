import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmStatus } from 'src/common/enums/enums';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { NceAlarmSearchFilterModel } from 'src/models/nce-alarm-search-filter.model';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import {
  Brackets,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class NCEAlarmsRepository extends BaseAbstractRepository<NceAlarm> {
  constructor(
    @InjectRepository(NceAlarm)
    private readonly nceAlarmRepository: Repository<NceAlarm>,
    private helperFunctions: HelperFunctions,
  ) {
    super(nceAlarmRepository);
  }
  async findAllWithPagination(
    nceAlarmSearchFilter: NceAlarmSearchFilterModel,
    searchColumns: string[],
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(nceAlarmSearchFilter);

    const query = this.nceAlarmRepository.createQueryBuilder('nceAlarm');

    const { take, skip, search, orderBy, orderDirection } =
      calculatedPagination;

    const {
      alarmName,
      severity,
      devices,
      alarmStatus,
      lastOccurredFrom,
      lastOccurredTo,
      alarmFilterConfigId,
      deviceName,
    } = nceAlarmSearchFilter;

    const createdOnFrom = lastOccurredFrom;
    const createdOnTo = lastOccurredTo;
    /**
     * for basic searchS
     */
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          for (let column of searchColumns) {
            qb.orWhere(`nceAlarm.${column} LIKE :search`, {
              search: `%${search}%`,
            });
          }
        }),
      );
    }

    // Filters
    if (alarmName) {
      let alarm;
      try {
        alarm = JSON.parse(alarmName);
      } catch (error) {
        alarm = [alarmName];
      }
      query.andWhere('nceAlarm.native_probable_cause IN(:...alarm)', {
        alarm,
      });
    }
    if (severity) {
      query.andWhere('nceAlarm.severity = :severity', { severity });
    }
    if (devices) {
      let neResourceIds: any;
      try {
        neResourceIds = JSON.parse(devices);
      } catch (error) {
        neResourceIds = [devices];
      }

      query.andWhere('nceAlarm.ne_resource_id IN (:...neResourceIds)', {
        neResourceIds,
      });
    }
    if (deviceName) {
      query
        .leftJoinAndSelect('nceAlarm.network_element', 'nce_network_element')
        .andWhere('nce_network_element.name =:name', {
          name: deviceName,
        });
    }
    if (alarmStatus) {
      const isCleared = alarmStatus === AlarmStatus.CLEARED ? 1 : 0;
      query.andWhere('nceAlarm.is_cleared = :isCleared', { isCleared });
    }
    if (createdOnFrom) {
      if (!createdOnTo) {
        const now = new Date();
        query.andWhere('nceAlarm.created_on BETWEEN :createdOnFrom AND :now', {
          createdOnFrom,
          now,
        });
      } else {
        query.andWhere(
          'nceAlarm.created_on BETWEEN :createdOnFrom AND :createdOnTo',
          { createdOnFrom, createdOnTo },
        );
      }
    }
    if (alarmFilterConfigId) {
      query.andWhere('nceAlarm.alarm_filter_config_id = :alarmFilterConfigId', {
        alarmFilterConfigId,
      });
    }

    // Fetch and count
    const [nceAlarms, total] = await query
      .leftJoinAndSelect('nceAlarm.alarm_filter_config', 'alarm_filter_config')
      .orderBy(
        orderBy
          ? { ['nceAlarm.' + orderBy]: orderDirection || 'DESC' }
          : { ['nceAlarm.id']: 'DESC' },
      )
      .take(take)
      .skip(skip)
      .getManyAndCount();
    const basicPaginationProps =
      this.helperFunctions.calculatPaginationProperties(total, take, skip);

    return {
      ...basicPaginationProps,
      list: nceAlarms,
    };
  }

  executeRawQuery(query: string) {
    return this.nceAlarmRepository.query(query);
  }

  getSelectQueryBuilder(): SelectQueryBuilder<NceAlarm> {
    return this.nceAlarmRepository.createQueryBuilder('na');
  }
}
