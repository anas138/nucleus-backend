import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { NceNetworkElementService } from 'src/modules/nce-network-element/nce-network-element.service';
import { ObsDeviceService } from 'src/modules/obs-device/obs-device.service';

/**
 * Consumer for sync-devices-queue to process syncing of devices
 */

@Processor(QUEUES.SYNC_DEVICES_QUEUE)
export class SyncDevicesQueueProcess {
  constructor(
    private nceNetworkElementServices: NceNetworkElementService,
    private obsDeviceService: ObsDeviceService,
  ) {}

  @Process()
  async syncDevices() {
    await this.nceNetworkElementServices.syncNetworkElements();
    await this.obsDeviceService.syncObsDevices();
  }
}
