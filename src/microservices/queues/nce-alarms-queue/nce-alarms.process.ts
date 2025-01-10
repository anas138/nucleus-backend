import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  APP_CONSTANTS,
  NCE_ALARM_CATEGORY,
  QUEUES,
} from 'src/common/enums/enums';
import { KafkaClientProducerService } from 'src/microservices/kafka/producers/kafka-client.service';
import {
  NCEAlarmModel,
  transformNCEAlarmResponse,
} from 'src/models/nce-alarm.model';
import { NceNmsCacheService } from 'src/modules/nce-nms/nce-nms.cache.service';
import { NceNmsService } from 'src/modules/nce-nms/nce-nms.service';
import { MngNceAlarmService } from 'src/modules/mng-nce-alarm/mng-nce-alarm.service';
import { transformedNceData } from 'src/models/mng-nce-alarm.model';

/**
 * LISTENER Level
 */

/**
 * NCE Raw Alarms Redis Queue Consumer
 * Consume Alarm received from Kafka Topic and transform message for Nucleus APP
 */
@Processor(QUEUES.NCE_ALARMS_QUEUE)
export class NceAlarmsQueueConsumer {
  constructor(
    private kafkaProducer: KafkaClientProducerService,
    private readonly nceNmsService: NceNmsService,
    private readonly nceNmsCacheService: NceNmsCacheService,
    private readonly mngNceAlarmService: MngNceAlarmService,
  ) {}

  @Process()
  async saveTask(job: Job<unknown>) {
    await job.progress(20);
    const message = await this.transformMesssage(job.data);
    if (message) {
      await this.kafkaProducer.pushMessageInNucleusNceAlaramsTopic(message);
    }
    const transformedData = transformedNceData(job.data);
    await this.mngNceAlarmService.createData(transformedData);
    await job.progress(100);
    return job.data;
  }

  /**
   * @description Transform NCE Alarm payload here
   * @param message
   */
  async transformMesssage(message: any): Promise<NCEAlarmModel> {
    if (message.hasOwnProperty('category')) {
      let neResId = null;
      let ltpResId = null;
      let resourceType = null;
      const resourceUrl: string =
        message['common-alarm-parameters']['resource-url'];

      // TODO: We may process only NE-associated alarms nd skip LTP (ports) alarms

      if (resourceUrl.includes('network-element')) {
        neResId = message['common-alarm-parameters']['resource'];
        resourceType = APP_CONSTANTS.NCE_ALARM_RESOURCE_TYPES.NE;
      } else {
        resourceType = APP_CONSTANTS.NCE_ALARM_RESOURCE_TYPES.LTP;
        ltpResId = message['common-alarm-parameters']['resource'];
        // Fetch NE Details From NCE NMS
        // const ltpDetails = await this.nceNmsCacheService.getLtpDetails(
        //   ltpResId,
        // );
        // if (!ltpDetails) {
        //   console.log('ltpResId does not exist', ltpResId);
        //   return null;
        // }
        // //TODO:  Instead of NMS fetch from Nucleus Database
        // neResId = ltpDetails.ne_id;
      }
      const data: NCEAlarmModel = transformNCEAlarmResponse(
        message,
        neResId,
        ltpResId,
        resourceType,
      );
      return data;
    }
  }
}
