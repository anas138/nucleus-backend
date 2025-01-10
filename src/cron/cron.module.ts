import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { SyncDevicesQueueModule } from 'src/microservices/queues/sync-devices-queue/sync-devices-queue.module';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';

@Module({
  imports: [ScheduleModule.forRoot(), SyncDevicesQueueModule],
  providers: [CronService, CacheManagerService],
})
export class CronModule {}
