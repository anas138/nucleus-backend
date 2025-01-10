import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUES } from 'src/common/enums/enums';
import { KafkaClientProducerService } from 'src/microservices/kafka/producers/kafka-client.service';
import { mngTransformObserviumAlertResponse } from 'src/models/obs-alert.model';
import { MngObsAlertsService } from 'src/modules/mng-obs-alerts/mng-obs-alerts.service';

/**
 * LISTENER Level
 */

@Processor(QUEUES.OBSERVIUM_ALERTS_QUEUE)
export class ObserviumAlertsQueueConsumer {
  constructor(
    private kafkaProducer: KafkaClientProducerService,
    private readonly mngObsAlertsService: MngObsAlertsService,
  ) {}
  @Process()
  async saveTask(job: Job<unknown>) {
    await this.kafkaProducer.pushMessageInObserviumAlaramsTopic(job.data);
    const transformedData = mngTransformObserviumAlertResponse(job.data);
    await this.mngObsAlertsService.createData(transformedData);
    await job.progress(100);
    return job.data;
  }
}
