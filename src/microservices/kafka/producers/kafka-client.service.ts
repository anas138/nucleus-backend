import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPICS, MICROSERVICES } from 'src/common/enums/enums';
import { NCEAlarmModel } from 'src/models/nce-alarm.model';
import { IObsAlert } from 'src/models/obs-alert.model';

/**
 * LISTENER Level
 */

@Injectable()
export class KafkaClientProducerService {
  constructor(@Inject(MICROSERVICES.KAFKA) private kafkaClient: ClientKafka) {}

  async pushMessageInNucleusNceAlaramsTopic(message: NCEAlarmModel) {
    await this.kafkaClient.emit(
      KAFKA_TOPICS.NUCLEUS_NCE_MAPPED_ALARMS,
      message,
    );
  }
  async pushMessageInObserviumAlaramsTopic(message: any) {
    await this.kafkaClient.emit(KAFKA_TOPICS.OBS_ALERTS, message);
  }
}
