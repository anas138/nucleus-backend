import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/common/enums/enums';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { ObserviumTransformedAlertsQueueService } from 'src/microservices/queues/observium-transformed-alerts-queue/observium-transformed-alerts-queue.service';
import { transformObserviumAlertResponse } from 'src/models/obs-alert.model';

/**
 * APP Level
 */

@Controller()
export class ObsNmsAlertsTopicSubscriber {
  constructor(
    private readonly queueService: ObserviumTransformedAlertsQueueService,
    private readonly helperFunctions: HelperFunctions,
  ) {}

  @MessagePattern(KAFKA_TOPICS.OBS_ALERTS)
  async listenKafkaStream(@Payload() message: any): Promise<any> {
    if (!this.helperFunctions.isObjectEmpty(message)) {
      const transformedMessage = transformObserviumAlertResponse(message);
      await this.queueService.addJobInQueue(transformedMessage);
    }
    return 'listening-end';
  }
}
