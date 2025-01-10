import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { Module } from '@nestjs/common';
import { SyncDevicesQueueService } from './sync-devices-queue.service';
import { ObsDeviceModule } from 'src/modules/obs-device/obs-device.module';
import { SyncDevicesQueueProcess } from './sync-devices-queue.process';
import { NceNetworkElementModule } from 'src/modules/nce-network-element/nce-network-element.module';

/**
 * to be included only in cron
 */
const queue = [
  BullModule.registerQueue({
    name: QUEUES.SYNC_DEVICES_QUEUE,
  }),
];

@Module({
  imports: [...queue, NceNetworkElementModule, ObsDeviceModule],
  providers: [SyncDevicesQueueService, SyncDevicesQueueProcess],
  exports: [SyncDevicesQueueService],
})
export class SyncDevicesQueueModule {}
