import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivityLogRepository } from './activity-log.repository';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class ActivityLogService extends BaseService<ActivityLog> {
  constructor(private activityLogRepository: ActivityLogRepository) {
    super(activityLogRepository);
  }
  async getById(id: number) {
    const where: FindManyOptions<ActivityLog> = {
      where: {
        related_id: id,
      },
    };
    return this.findAll(where);
  }
}
