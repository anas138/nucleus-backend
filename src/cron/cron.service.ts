import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { SyncDevicesQueueService } from 'src/microservices/queues/sync-devices-queue/sync-devices-queue.service';

@Injectable()
export class CronService implements OnModuleInit, OnModuleDestroy {
  private isLeader = false;
  private static cacheLeaderKey = 'cron-leader';

  constructor(
    private syncDevicesQueueService: SyncDevicesQueueService,
    private cacheManagerService: CacheManagerService,
    private configService: EnvironmentConfigService,
  ) {}

  async onModuleInit() {
    await this.electLeader();
  }

  async onModuleDestroy() {
    if (this.isLeader) {
      await this.cacheManagerService.delete(CronService.cacheLeaderKey);
    }
  }

  async electLeader() {
    const result = await this.cacheManagerService.getOrSet(
      CronService.cacheLeaderKey,
      'true',
      60 * 60,
    );
    if (result === 'success_set') {
      this.isLeader = true;
    }
  }

  /**
   * @description IMP: Need to make sure CRON JOBS are scheduled ONCE if process running in a cluster MODE
   *              This is happening by just setting leader-key in CACHE for 60 seconds and schedule job if key already set in cache
   */

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncNetworkDevicesFromNMS() {
    if (this.configService.getNodeEnvironment() !== 'local') {
      if (this.isLeader) {
        //await this.syncDevicesQueueService.addJobInQueue()
      }
    } else {
      // await this.syncDevicesQueueService.addJobInQueue()
    }
  }

  // add more cron jobs below
}
