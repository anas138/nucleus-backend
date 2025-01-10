import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/common/enums/enums';
import { NceGponTransformedAlarmsQueueService } from 'src/microservices/queues/nce-gpon-transformed-alarm-queue/nce-gpon-transformed-alarms-queue.service';
import { Logger } from '@nestjs/common';
import { NokiaTxnTransformedAlarmsQueueService } from 'src/microservices/queues/nokia-txn-transformed-alarm-queue/nokia-txn-transformed-alarm-queue.service';

/**
 * APP Level
 */

@Controller()
export class NokiaTxnMappedAlarmsTopicSubscriber {
  private logger = new Logger();
  constructor(
    private nokiaTxnTransformedAlarmsQueueService: NokiaTxnTransformedAlarmsQueueService,
  ) {}

  @MessagePattern(KAFKA_TOPICS.NOKIA_TXN_TRANSFORMED_ALARMS)
  async listenKafkaStream(@Payload() message: any): Promise<any> {
    await this.nokiaTxnTransformedAlarmsQueueService.addJobInQueue(message);
  }
}
