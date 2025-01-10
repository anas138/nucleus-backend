import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivityLogController } from './activity.log.controller';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogRepository } from './activity-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  providers: [ActivityLogService, ActivityLogRepository],
  controllers: [ActivityLogController],
  exports: [ActivityLogService, ActivityLogRepository],
})
export class ActivityLogModule {}
