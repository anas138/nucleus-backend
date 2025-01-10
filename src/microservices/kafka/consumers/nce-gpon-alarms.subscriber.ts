import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/common/enums/enums';
import { NceGponTransformedAlarmsQueueService } from 'src/microservices/queues/nce-gpon-transformed-alarm-queue/nce-gpon-transformed-alarms-queue.service';
import { Logger } from '@nestjs/common';

/**
 * APP Level
 */

@Controller()
export class NceGponMappedAlarmsTopicSubscriber {
  private logger = new Logger();
  constructor(
    private nceGponTransformedAlarmsQueueService: NceGponTransformedAlarmsQueueService,
  ) {}

  @MessagePattern(KAFKA_TOPICS.NCE_GPON_TRANSFORMED_ALARMS)
  async listenKafkaStream(@Payload() message: any): Promise<any> {
    await this.nceGponTransformedAlarmsQueueService.addJobInQueue(message);
  }
}
