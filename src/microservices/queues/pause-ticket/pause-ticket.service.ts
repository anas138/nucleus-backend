import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Injectable()
export class PauseTicketQueueService {
  constructor(
    private env: EnvironmentConfigService,
    @InjectQueue(QUEUES.PAUSE_TICKET) readonly queue: Queue,
  ) {
    queuePool.add(queue);
  }

  async addJobInQueue(data: any, delayInSeconds: number) {
    return this.queue.add(data, { delay: delayInSeconds * 1000 });
  }

  async getJobQueue(id: number) {
    const job = await this.queue.getDelayed();
    if (job) {
      const pauseJob: Job<any> = job.find(
        (singleJob) => singleJob.data?.id === id,
      );
      if (pauseJob?.id) await this.queue.removeJobs(`${pauseJob.id}`);
    }
  }
}
