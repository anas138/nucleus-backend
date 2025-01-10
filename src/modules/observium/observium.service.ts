import { Injectable } from '@nestjs/common';
import { KafkaClientProducerService } from 'src/microservices/kafka/producers/kafka-client.service';
import { ObserviumAlertsQueueService } from 'src/microservices/queues/observium-alerts-queue/observium-alerts-queue.service';

@Injectable()
export class ObserviumService {
  constructor(private queueService: ObserviumAlertsQueueService) {}

  /**
   * 
   * @param payload 
   * @returns 
   * @description Send in listener-level redis-queue 'observium-alerts-queue' to consume & send to Kafka-Topic 1by1
   */
  async handleAlertPost(payload: any) {
    await this.queueService.addJobInQueue(payload);
    return;
  }
}
