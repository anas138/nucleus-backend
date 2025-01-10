import { KafkaOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const KafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: { brokers: [process.env.KAFKA_HOST] },
    producer: { allowAutoTopicCreation: true },
    consumer: {
      groupId: 'consumer-group-' + process.env.KAFKA_CONSUMER_GROUP,
      retry: { initialRetryTime: 5000, retries: 2 },
    },
  },
};
