import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { AlarmRecipientRepository } from './alarm-recipient.repository';
import { AlarmRecipient } from 'src/entities/alarm-recipient.entity';
import { APP_MESSAGES, RecordStatus } from 'src/common/enums/enums';
import { EntityManager, FindOptionsWhere } from 'typeorm';

@Injectable()
export class AlarmRecipientService extends BaseService<AlarmRecipient> {
  constructor(private readonly repo: AlarmRecipientRepository) {
    super(repo);
  }

  async ifValidRemove(id: number) {
    const data = await this.repo.findOneById({ id });
    if (!data) {
      throw new NotFoundException(
        APP_MESSAGES.ALARM_RECIPIENTS.ERROR_NOT_FOUND,
      );
    }
    //data.record_status = RecordStatus.DELETED;
    return this.repo.deleteRecord({ id: data.id });
  }

  async updateAlarmRecipientWithTransactionScope(
    id: FindOptionsWhere<AlarmRecipient>,
    data: Partial<AlarmRecipient>,
    entityManager: EntityManager,
  ): Promise<AlarmRecipient> {
    const existingData = await this.repo.findOneById(id);

    if (!existingData) {
      throw new NotFoundException('Data not found');
    }

    if (data.group_user_id) {
      existingData.single_user_id = null;
      existingData.sub_department_id = null;
    } else if (data.single_user_id) {
      existingData.group_user_id = null;
      existingData.sub_department_id = null;
    } else {
      existingData.single_user_id = null;
      existingData.group_user_id = null;
    }

    return this.repo.updateWithTransactionScope(
      { ...existingData, ...data },
      entityManager,
    );
  }
}
