import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICES } from 'src/common/enums/enums';
import { KafkaConfig } from 'src/config/kafka.config';
import { NucleusNceMappedAlarmsTopicSubscriber } from './consumers/nucleus-nce-alarms.subscriber';
import { NceTransformedAlarmsQueueModule } from '../queues/nce-transformed-alarms/nce-transformed-alarms.module';
import { KafkaClientProducerService } from './producers/kafka-client.service';
import { ObsNmsAlertsTopicSubscriber } from './consumers/obs-nms-alerts.subscriber';
import { ObserviumTransformedAlertsQueueModule } from '../queues/observium-transformed-alerts-queue/observium-transformed-alerts.module';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceGponMappedAlarmsTopicSubscriber } from './consumers/nce-gpon-alarms.subscriber';
import { NceGponTransformedAlarmsQueueModule } from '../queues/nce-gpon-transformed-alarm-queue/nce-gpon-transformed-alarms-queue.module';
import { NokiaTxnMappedAlarmsTopicSubscriber } from './consumers/nokia-txn-alarms.subscriber';
import { NokiaTxnTransformedAlarmsQueueModule } from '../queues/nokia-txn-transformed-alarm-queue/nokia-txn-transformed-alarm-queue.module';
import { LdiSoftAlarmsTopicSubscriber } from './consumers/ldi-softswitch-alarms.subscriber';
import { LdiSoftswitchAlarmQueueModule } from '../queues/ldi-softswitch-alarm-queue/ldi-softswitch-alarm-queue.module';

const configService = new EnvironmentConfigService(new ConfigService());
const logger: Logger = new Logger('KafkaModule');

/**
 * Dynamic kafka-topics subscribers
 */
const kafkaTopicsSubscribers = [];
const appModules = [];
const kafkaControllers = [];
logger.log(
  `Listener ${configService.getIsNucleusListnerEnabled()} , App: ${configService.getIsNucleusAppEnabled()}`,
);
if (configService.isKafkaEnabled()) {
  if (configService.getIsNucleusAppEnabled()) {
    kafkaTopicsSubscribers.push(NucleusNceMappedAlarmsTopicSubscriber);
    kafkaTopicsSubscribers.push(ObsNmsAlertsTopicSubscriber);
    kafkaTopicsSubscribers.push(NceGponMappedAlarmsTopicSubscriber);
    kafkaTopicsSubscribers.push(NokiaTxnMappedAlarmsTopicSubscriber);
    kafkaTopicsSubscribers.push(LdiSoftAlarmsTopicSubscriber);

    appModules.push(NceTransformedAlarmsQueueModule);
    appModules.push(ObserviumTransformedAlertsQueueModule);
    appModules.push(NceGponTransformedAlarmsQueueModule);
    appModules.push(NokiaTxnTransformedAlarmsQueueModule);
    appModules.push(LdiSoftswitchAlarmQueueModule);
  }
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.KAFKA,
        ...KafkaConfig,
      },
    ]),
    ...kafkaControllers,
    ...appModules,
  ],
  providers: [KafkaClientProducerService, HelperFunctions],
  controllers: [...kafkaTopicsSubscribers],
  exports: [KafkaClientProducerService],
})
export class KafkaModule {}
