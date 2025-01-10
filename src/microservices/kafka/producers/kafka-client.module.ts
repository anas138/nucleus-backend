import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICES } from 'src/common/enums/enums';
import { KafkaConfig } from 'src/config/kafka.config';
import { KafkaClientProducerService } from './kafka-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.KAFKA,
        ...KafkaConfig,
      },
    ]),
  ],
  providers: [KafkaClientProducerService],
  exports: [KafkaClientProducerService],
})
export class KafkaClientModule {}
