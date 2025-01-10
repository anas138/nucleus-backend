import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/common/enums/enums';
import { NceGponTransformedAlarmsQueueService } from 'src/microservices/queues/nce-gpon-transformed-alarm-queue/nce-gpon-transformed-alarms-queue.service';
import { Logger } from '@nestjs/common';
import { LdiSoftswitchTransformedAlarmsQueueService } from 'src/microservices/queues/ldi-softswitch-alarm-queue/ldi-softswitch-alarm-queue.service';
import { LdiSoftswitchAlarmQueueMessage } from 'src/models/ldi-softswitch-alarm-queue-message.model';

/**
 * APP Level
 */

@Controller()
export class LdiSoftAlarmsTopicSubscriber {
  private logger = new Logger(LdiSoftAlarmsTopicSubscriber.name);
  constructor(
    private readonly ldiSoftswitchTransformedAlarmsQueueService: LdiSoftswitchTransformedAlarmsQueueService,
  ) {}

  @MessagePattern(KAFKA_TOPICS.LDI_SOFT_SWITCH_TRANSFORMED_ALARMS)
  async listenKafkaStream(
    @Payload() message: LdiSoftswitchAlarmQueueMessage,
  ): Promise<any> {
    await this.ldiSoftswitchTransformedAlarmsQueueService.addJobInQueue(
      message,
    );
  }
}
