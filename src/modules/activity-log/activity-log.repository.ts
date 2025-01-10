import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { ActivityLog } from 'src/entities/activity-log.entity';

@Injectable()
export class ActivityLogRepository extends BaseAbstractRepository<ActivityLog> {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {
    super(activityLogRepository);
  }
}
