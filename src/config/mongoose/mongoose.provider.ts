import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
const configSerivce = new EnvironmentConfigService(new ConfigService());

export const mongooseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<any> => {
      try {
        const connection = await mongoose.connect(configSerivce.getMongoUrl());
        const db = mongoose.connection;
        db.on('error', (error) => {
          throw error;
        });
        return db.once('open', () => {
          return connection;
        });
      } catch (error) {
        throw error;
      }
    },
  },
];
