import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { LdiSoftswitchTrunkGroup } from 'src/entities/ldi-softswitch-trunk-group.entity';
import { LdiSoftswitchEmsAlarm } from 'src/entities/ldi-softswitch-alarm.entity';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { AlarmStatus } from 'src/common/enums/enums';
import { LdiSoftswitchAlarmsFilterModel } from 'src/models/ldi-softswitch-alarm-queue-message.model';
import { PaginatedResultsModel } from 'src/models/pagination.model';

export class LdiSoftSwitchAlarmRepository extends BaseAbstractRepository<LdiSoftswitchEmsAlarm> {
  constructor(
    @InjectRepository(LdiSoftswitchEmsAlarm)
    private readonly repo: Repository<LdiSoftswitchEmsAlarm>,
    private helperFunctions: HelperFunctions,
  ) {
    super(repo);
  }

  async findAllWithPagination(
    searchFilter: LdiSoftswitchAlarmsFilterModel,
    searchColumns: string[],
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination =
      this.helperFunctions.calculatePagination(searchFilter);

    const query = this.repo.createQueryBuilder('ldi');
    query.leftJoinAndSelect('ldi.alarmType', 'DropDownItem');

    const { take, skip, search, orderBy, orderDirection } =
      calculatedPagination;

    const {
      category,
      severity,
      alarmType,
      trunkGroup,
      lastOccurredFrom,
      lastOccurredTo,
      alarmFilterConfigId,
      alarmStatus,
    } = searchFilter;

    const createdOnFrom = lastOccurredFrom;
    const createdOnTo = lastOccurredTo;
    /**
     * for basic searchS
     */
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          for (let column of searchColumns) {
            qb.orWhere(`LOWER(ldi.${column}) LIKE :search`, {
              search: `%${search.toLocaleLowerCase()}%`,
            });
          }
        }),
      );
    }

    // Filters
    if (alarmFilterConfigId) {
      let alarmConfigIds: any;
      try {
        alarmConfigIds = JSON.parse(alarmFilterConfigId);
        if (!Array.isArray(alarmConfigIds)) alarmConfigIds = [alarmConfigIds];
      } catch (error) {
        alarmConfigIds = [alarmFilterConfigId];
      }
      query.andWhere('ldi.alarm_filter_config_id IN(:...alarmConfigIds)', {
        alarmConfigIds,
      });
    }
    if (severity) {
      query.andWhere('ldi.severity = :severity', { severity });
    }
    if (trunkGroup) {
      let trunkGroupNames: any;
      try {
        trunkGroupNames = JSON.parse(trunkGroup);
      } catch (error) {
        trunkGroupNames = [trunkGroup];
      }
      query.andWhere('ldi.trunk_group IN (:...trunkGroupNames)', {
        trunkGroupNames,
      });
    }

    if (alarmStatus) {
      const isCleared = alarmStatus === AlarmStatus.CLEARED ? 1 : 0;
      query.andWhere('ldi.is_cleared = :isCleared', { isCleared });
    }

    if (createdOnFrom) {
      if (!createdOnTo) {
        const now = new Date();
        query.andWhere('ldi.created_on BETWEEN :createdOnFrom AND :now', {
          createdOnFrom,
          now,
        });
      } else {
        query.andWhere(
          'ldi.created_on BETWEEN :createdOnFrom AND :createdOnTo',
          { createdOnFrom, createdOnTo },
        );
      }
    }
    if (category) {
      query.andWhere('ldi.category = :category', {
        category,
      });
    }

    if (alarmType) {
      query.andWhere('ldi.alarm_type = :alarmType', {
        alarmType,
      });
    }

    // Fetch and count
    const [ldiAlarms, total] = await query
      .leftJoinAndSelect('ldi.alarm_filter_config', 'alarm_filter_config')
      .orderBy(
        orderBy
          ? { ['ldi.' + orderBy]: orderDirection || 'DESC' }
          : { ['ldi.id']: 'DESC' },
      )
      .take(take)
      .skip(skip)
      .getManyAndCount();
    const basicPaginationProps =
      this.helperFunctions.calculatPaginationProperties(total, take, skip);

    return {
      ...basicPaginationProps,
      list: ldiAlarms,
    };
  }
  executeRawQuery(query: string) {
    return this.repo.query(query);
  }

  getSelectQueryBuilder(): SelectQueryBuilder<LdiSoftswitchEmsAlarm> {
    return this.repo.createQueryBuilder('na');
  }
}
