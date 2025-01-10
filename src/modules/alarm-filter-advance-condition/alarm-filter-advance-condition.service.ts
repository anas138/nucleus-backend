import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { AlarmFilterAdvanceConditionRepository } from './alarm-filter-advance-condition.repository';
import { AlarmFilterAdvanceCondition } from 'src/entities/alarm-filter-advance-condition.entity';
import {
  APP_MESSAGES,
  RecordStatus,
} from 'src/common/enums/enums';

@Injectable()
export class AlarmFilterAdvanceConditionService extends BaseService<AlarmFilterAdvanceCondition> {
  constructor(
    private readonly repo: AlarmFilterAdvanceConditionRepository,
  ) {
    super(repo);
  }

  async ifValidRemove(id: number) {
    const data = await this.repo.findOneById({ id });
    if (!data) {
      throw new NotFoundException(
        APP_MESSAGES.ALARM_ADV_CONDITIONS.ERROR_NOT_FOUND,
      );
    }
    data.record_status = RecordStatus.DELETED;
    return this.repo.remove(data);
  }
}
