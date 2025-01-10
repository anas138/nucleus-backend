import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { queuePool } from '../bull-board-queue';
import { AlarmDelayedActionsModel } from 'src/models/alarm-delayed-actions.model';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Injectable()
export class AlarmDelayedActionsService {
  constructor(
    @InjectQueue(QUEUES.ALARMS_DELAYED_ACTIONS_QUEUE)
    private readonly queue: Queue,
    private envService: EnvironmentConfigService,
  ) {
    queuePool.add(queue);
  }

  addJobInQueue(data: AlarmDelayedActionsModel, delayInMinutes: number) {
    if (this.envService.shouldDelayAlarmActions()) {
      return this.queue.add(data, { delay: delayInMinutes * 60 * 1000 });
    }
  }
}
