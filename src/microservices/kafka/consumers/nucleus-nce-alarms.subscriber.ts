import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/common/enums/enums';
import { NceTransformedAlarmsQueueService } from 'src/microservices/queues/nce-transformed-alarms/nce-transformed-alarms-queue.service';

/**
 * APP Level
 */

@Controller()
export class NucleusNceMappedAlarmsTopicSubscriber {
  constructor(
    private transformedAlarmsQueueService: NceTransformedAlarmsQueueService,
  ) {}

  @MessagePattern(KAFKA_TOPICS.NUCLEUS_NCE_MAPPED_ALARMS)
  async listenKafkaStream(@Payload() message: any): Promise<any> {
    await this.transformedAlarmsQueueService.addJobInQueue(message);
  }
}
